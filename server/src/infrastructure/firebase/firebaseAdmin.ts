import admin from "firebase-admin";
import { env } from "../../config/env";
import logger from "../../shared/logger";

let app: admin.app.App | null = null;

export function initializeFirebase(): admin.app.App {
  if (app) {
    return app;
  }

  try {
    if (env.NODE_ENV === "development") {
      logger.info("Initializing Firebase with emulator for development");

      const emulatorHost = process.env.FIREBASE_EMULATOR_HOST || "localhost";
      const emulatorPort = parseInt(
        process.env.FIREBASE_EMULATOR_PORT || "9000"
      );
      const namespace =
        process.env.FIREBASE_RTDB_NAMESPACE || "rentredi-assessment-dev";

      const databaseURL =
        env.FIREBASE_DATABASE_URL ||
        `http://${emulatorHost}:${emulatorPort}?ns=${namespace}`;

      app = admin.initializeApp({
        projectId: "rentredi-assessment-dev",
        databaseURL: databaseURL,
      });

      const database = app.database();
      database.useEmulator(emulatorHost, emulatorPort);

      logger.info(
        `Firebase Database emulator connected on ${emulatorHost}:${emulatorPort} with namespace: ${namespace}`
      );
      logger.info(`Database URL: ${databaseURL}`);
    } else {
      if (
        !env.FIREBASE_PROJECT_ID ||
        !env.FIREBASE_PRIVATE_KEY ||
        !env.FIREBASE_CLIENT_EMAIL
      ) {
        logger.error(
          "Firebase credentials not found for production. Please set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL environment variables."
        );
        throw new Error("Firebase credentials required for production");
      }

      const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
      const databaseURL =
        env.FIREBASE_DATABASE_URL ||
        `https://${env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`;

      app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          privateKey: privateKey,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
        }),
        databaseURL: databaseURL,
      });

      logger.info(
        `Firebase Admin initialized for production project: ${env.FIREBASE_PROJECT_ID} with database URL: ${databaseURL}`
      );
    }

    logger.info("Firebase Admin initialized successfully");
    return app;
  } catch (error) {
    logger.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

export function getFirebaseApp(): admin.app.App {
  if (!app) {
    return initializeFirebase();
  }
  return app;
}

export function getDatabase(): admin.database.Database {
  const firebaseApp = getFirebaseApp();
  return firebaseApp.database();
}
