import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

process.env.NODE_ENV = "test";
process.env.OPENWEATHER_API_KEY = "test-api-key";
process.env.OPENWEATHER_API_BASE_URL =
  "https://api.openweathermap.org/data/2.5";
process.env.FIREBASE_PROJECT_ID = "test-project";
process.env.FIREBASE_DATABASE_URL = "https://test-project.firebaseio.com";

global.console = {
  ...console,
};
