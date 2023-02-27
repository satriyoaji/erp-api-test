import { config } from "dotenv";

config();

export const googleAuthConfig = {
  clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_AUTH_REDIRECT_URI,
};
