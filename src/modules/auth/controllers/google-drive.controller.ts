import fs from "fs";
import path from "path";
import process from "process";
// import { authenticate } from "@google-cloud/local-auth";
import { NextFunction, Request, Response } from "express";
import { google } from "googleapis";
// import { drive } from "googleapis/build/src/apis/drive";

export const googleDrive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const REDIRECT_URI = "https://developers.google.com/oauthplayground/";
    const REFRESH_TOKEN = "";

    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    const dir = new URL(".", import.meta.url).pathname;
    const filePath = path.join("/Users/martiendt/Projects/client/merlion-api", "logo-icon.png");

    const file = await drive.files.create({
      requestBody: {
        name: "merlion-app",
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id",
    });
    const folderId = file.data.id as string;

    const response = await drive.files.create({
      requestBody: {
        name: "pointhub.png",
        mimeType: "image/png",
        parents: [folderId],
      },
      media: {
        mimeType: "image/png",
        body: fs.createReadStream(filePath),
      },
    });

    console.log(response.data);

    return res.json("asd");
  } catch (error) {
    return res.json("error");
    next(error);
  }
};

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
// async function loadSavedCredentialsIfExist() {
//   try {
//     // const content = await fs.readFile(TOKEN_PATH);
//     // const credentials = JSON.parse(content);
//     // return google.auth.fromJSON(credentials);
//     return new google.auth.OAuth2(
//       process.env.GOOGLE_DRIVE_CLIENT_ID,
//       process.env.GOOGLE_DRIVE_CLIENT_SECRET,
//       "http://localhost:3000"
//     );
//   } catch (err) {
//     return null;
//   }
// }

// /**
//  * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
//  *
//  * @param {OAuth2Client} client
//  * @return {Promise<void>}
//  */
// async function saveCredentials(client) {
//   const content = await fs.readFile(CREDENTIALS_PATH);
//   const keys = JSON.parse(content);
//   const key = keys.installed || keys.web;
//   const payload = JSON.stringify({
//     type: "authorized_user",
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   });
//   await fs.writeFile(TOKEN_PATH, payload);
// }

/**
 * Load or request or authorization to call APIs.
 *
 */
// async function authorize() {
//   let client = await loadSavedCredentialsIfExist();
//   if (client) {
//     return client;
//   }
//   client = await authenticate({
//     scopes: ["https://www.googleapis.com/auth/drive"],
//     keyfilePath: CREDENTIALS_PATH,
//   });
//   if (client.credentials) {
//     await saveCredentials(client);
//   }
//   return client;
// }

// /**
//  * Lists the names and IDs of up to 10 files.
//  * @param {OAuth2Client} authClient An authorized OAuth2 client.
//  */
// async function listFiles(authClient) {
//   const drive = google.drive({ version: "v3", auth: authClient });
//   const res = await drive.files.list({
//     pageSize: 10,
//     fields: "nextPageToken, files(id, name)",
//   });
//   const files = res.data.files;
//   if (files.length === 0) {
//     console.log("No files found.");
//     return;
//   }

//   console.log("Files:");
//   files.map((file) => {
//     console.log(`${file.name} (${file.id})`);
//   });
// }

// authorize().then(listFiles).catch(console.error);
