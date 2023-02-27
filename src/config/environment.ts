import fs from "fs";
import dotenv from "dotenv";

/**
 * Setup environment
 */
export const setupEnvironment = (env: string) => {
  dotenv.config({
    path: getPath(env),
  });
};

/**
 * Get path of environment file
 * .env (not shared) is used in production mode.
 * .env.development(shared) and .env.development.local (not shared) are used in development mode.
 * .env.test(shared) and .env.test.local (not shared) are used in test mode.
 */
const getPath = (env: string) => {
  if (!fs.existsSync(`.env.${env}.local`)) {
  }
  return env === "test" ? ".env.test" : ".env";
};

export default dotenv;
