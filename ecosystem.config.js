// CodeAI-X — PM2 process configuration
// This file belongs in backend/ (the Docker build context) so
// Dockerfile.backend can copy it into the runtime image.
// DevOps owns HOW the process runs; it does not define app logic.

module.exports = {
  apps: [
    {
      name: "codeaix-backend",
      script: "dist/server.js",
      exec_mode: "cluster",
      instances: "max", // one worker per CPU core available to the container
      watch: false,
      max_memory_restart: "400M",
      kill_timeout: 5000, // grace period for in-flight requests on SIGTERM
      listen_timeout: 8000,
      wait_ready: true,
      env_production: {
        NODE_ENV: "production",
      },
      error_file: "/app/logs/pm2-error.log",
      out_file: "/app/logs/pm2-out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
