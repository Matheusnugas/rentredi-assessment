import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttp from 'pino-http';
import rateLimit from 'express-rate-limit';
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import logger from "./shared/logger";
import {
  enhancedRequestLogger,
  errorLogger,
} from "./shared/logger/enhancedRequestLogger";
import { errorHandler, notFoundHandler } from "./shared/http/errorHandler";
import { responseWrapper } from "./shared/http/responseWrapper";
import { usersRoutes } from "./interfaces/http/users.routes";
import { analyticsRoutes } from "./interfaces/http/analytics.routes";
import { getDatabase } from "./infrastructure/firebase/firebaseAdmin";
import { specs } from "./config/swagger";

export function createApp(): express.Application {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin:
        env.NODE_ENV === "production"
          ? env.FRONTEND_BASE_URL
            ? [env.FRONTEND_BASE_URL]
            : false
          : true,
      credentials: true,
    })
  );

  app.use(compression());

  app.use(enhancedRequestLogger);

  app.use(
    pinoHttp({
      logger,
      customLogLevel: (req, res, err) => {
        if (res.statusCode >= 400 && res.statusCode < 500) return "warn";
        if (res.statusCode >= 500 || err) return "error";
        return "info";
      },
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  app.use(responseWrapper);

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests from this IP, please try again later",
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api", limiter);

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "RentRedi API Documentation",
    })
  );

  app.use("/api/users", usersRoutes);
  app.use("/api/analytics", analyticsRoutes);

  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Health check endpoint
   *     description: Returns the health status of the service
   *     tags: [System]
   *     responses:
   *       200:
   *         description: Service is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Health check passed"
   *                 data:
   *                   type: object
   *                   properties:
   *                     status:
   *                       type: string
   *                       example: "ok"
   *                     uptime:
   *                       type: number
   *                       example: 123.456
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   */
  app.get("/health", (req, res) => {
    res.success(
      {
        status: "ok",
        uptime: process.uptime(),
      },
      "Health check passed"
    );
  });

  app.get("/test-logging", (req, res) => {
    res.success(
      {
        message: "Enhanced logging test endpoint",
        timestamp: new Date().toISOString(),
        correlationId: req.headers["x-correlation-id"],
        clientInfo: {
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          acceptLanguage: req.headers["accept-language"],
        },
      },
      "Enhanced logging test successful"
    );
  });

  /**
   * @swagger
   * /ready:
   *   get:
   *     summary: Readiness check endpoint
   *     description: Checks if the service and its dependencies are ready to handle requests
   *     tags: [System]
   *     responses:
   *       200:
   *         description: Service is ready
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Service is ready (development mode with Firebase emulator)"
   *                 data:
   *                   type: object
   *                   properties:
   *                     status:
   *                       type: string
   *                       example: "ready"
   *                     services:
   *                       type: object
   *                       properties:
   *                         database:
   *                           type: string
   *                           example: "emulator"
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *       503:
   *         description: Service dependencies not available
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiErrorResponse'
   */
  app.get("/ready", async (req, res) => {
    try {
      const database = getDatabase();

      if (env.NODE_ENV === "development") {
        try {
          await database.ref("users").once("value");
          res.success(
            {
              status: "ready",
              services: {
                database: "emulator",
              },
            },
            "Service is ready (development mode with Firebase emulator)"
          );
        } catch (error) {
          logger.warn(
            "Firebase emulator not running, but continuing in development mode"
          );
          res.success(
            {
              status: "ready",
              services: {
                database: "emulator_unavailable",
              },
            },
            "Service is ready (development mode - Firebase emulator not running)"
          );
        }
      } else {
        await database.ref(".info/connected").once("value");
        res.success(
          {
            status: "ready",
            services: {
              database: "connected",
            },
          },
          "Service is ready"
        );
      }
    } catch (error) {
      logger.error(error, "Readiness check failed");
      res.error(
        "SERVICE_UNAVAILABLE",
        "Service dependencies not available",
        503
      );
    }
  });

  app.use(notFoundHandler);
  app.use(errorLogger);
  app.use(errorHandler);

  return app;
} 