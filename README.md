# CodeAI-X — AI Engine

This package is the **AI Engine** for CodeAI-X. It contains all LLM
orchestration, prompt engineering, memory, tools, and code generators.
It has **no frontend and no backend code** — it is a pure engine that the
backend team imports and calls.

## Install

```bash
cd ai-engine
npm install
cp .env.example .env   # fill in ANTHROPIC_API_KEY and/or OPENAI_API_KEY
npm run build
```

## Folder structure

```
ai-engine/
  src/
    core/
      router.ts          # classifies task type + language, picks a model
      llmClient.ts        # provider-agnostic Anthropic/OpenAI client
      orchestrator.ts      # main request pipeline
    memory/
      memoryManager.ts     # conversation, project, and preference memory
    prompts/
      systemPrompts.ts     # one system prompt builder per task type
    tools/
      fileReader.ts
      projectAnalyzer.ts    # FolderAnalyzer + ProjectAnalyzer
      dependencyAnalyzer.ts
      codeAnalyzer.ts
      codeFormatter.ts
      errorAnalyzer.ts
      index.ts             # tool registry
    generators/
      index.ts             # README / Tests / Dockerfile / CI / REST API generators
    config/
      models.ts            # model registry (which LLM handles which task)
    types/
      index.ts             # all shared TypeScript types
    utils/
      responseParser.ts    # parses FILE: markers + code blocks from LLM output
    index.ts               # PUBLIC ENTRY POINT — the only file to import from
```

## Usage (from the backend)

```ts
import { AIEngine } from "@codeai-x/ai-engine";

const engine = new AIEngine();

// Non-streaming
const response = await engine.chat({
  sessionId: "user-123-session-1",
  userInput: "Build me a REST API for a todo list in Node.js with Express",
});

console.log(response.explanation);
for (const file of response.files) {
  console.log(file.path, file.language, file.content.length);
}

// Streaming
await engine.chatStream(
  { sessionId: "user-123-session-1", userInput: "Now add authentication" },
  (chunk) => {
    if (chunk.type === "explanation") process.stdout.write(chunk.delta ?? "");
    if (chunk.type === "file_end") console.log(`\n[file complete: ${chunk.filePath}]`);
  }
);

// Task-specific generators
const readme = await engine.generators.readme({
  sessionId: "user-123-session-1",
  projectName: "Todo API",
  description: "A simple todo list REST API.",
  files: [{ path: "src/index.ts", content: "..." }],
});
```

## Persistence

By default, `AIEngine` keeps session memory in-process (`InMemoryStore`),
which is fine for local development but is lost on restart and does not
scale across multiple instances. For production, the backend should
inject a persistent store:

```ts
import { AIEngine, MemoryStore } from "@codeai-x/ai-engine";

class RedisMemoryStore implements MemoryStore {
  async get(sessionId: string) { /* ... */ }
  async set(sessionId: string, snapshot: unknown) { /* ... */ }
  async delete(sessionId: string) { /* ... */ }
}

const engine = new AIEngine({ memoryStore: new RedisMemoryStore() });
```

## Extending

- **New task type**: add it to `TaskType` in `types/index.ts`, add a
  prompt builder in `prompts/systemPrompts.ts`, add a classification rule
  in `core/router.ts`, and add it to a model's `strengths` in
  `config/models.ts`.
- **New tool**: implement `ToolDefinition` in `tools/`, then register it
  in `tools/index.ts`.
- **New generator**: add a function in `generators/index.ts` that calls
  `Orchestrator.handleRequest` with a pinned `taskTypeHint`, then expose
  it via `AIEngine.generators` in `src/index.ts`.

## Design principles enforced by every prompt

- Always explain before generating code.
- Only complete files — no partial snippets, no `TODO`, no "implement later".
- Every file is prefixed with `FILE: <path>` so responses can be parsed
  into structured file outputs automatically.
- Production quality: secure, scalable, SOLID, no hardcoded secrets.
