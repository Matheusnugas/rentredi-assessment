import { createApp } from "./app";
import { env } from "./config/env";
import logger from "./shared/logger";

const app = createApp();
const port = parseInt(env.PORT, 10);

app.listen(port, () => {
  logger.info(`🚀 Server running on port ${port}`);
  logger.info(`📋 Health check: http://localhost:${port}/health`);
  logger.info(`🔍 Readiness check: http://localhost:${port}/ready`);
  logger.info(`👥 Users API: http://localhost:${port}/api/users`);
  logger.info(`🌍 Environment: ${env.NODE_ENV}`);
});
