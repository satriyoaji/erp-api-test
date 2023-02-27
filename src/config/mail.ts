import { config } from "dotenv";

config();

export const mailConfig = {
  fromName: process.env.MAIL_FROM_NAME || "",
  fromAddress: process.env.MAIL_FROM_ADDRESS || "",
};

export const smtpConfig = {
  host: process.env.MAIL_HOST || "localhost",
  port: process.env.MAIL_PORT || "1025",
  secure: process.env.MAIL_SECURE || false,
  username: process.env.MAIL_USERNAME || "project.1",
  password: process.env.MAIL_PASSWORD || "secret.1",
};

export const mailgunConfig = {
  domain: process.env.MAILGUN_DOMAIN || "",
  apiKey: process.env.MAILGUN_APIKEY || "",
};
