/* 
Google Drive API:
Demonstration to:
1. upload 
2. delete 
3. create public URL of a file.
required npm package: googleapis
https://developers.google.com/drive/api/guides/about-files
*/
import { Stream } from "stream";
import { google } from "googleapis";
import { hashObject } from "./hash.js";
import { googleAuthConfig } from "@src/config/oauth.js";

export class GoogleDrive {
  private drive;
  private authClient;
  constructor(tokens: any) {
    this.authClient = new google.auth.OAuth2(
      googleAuthConfig.clientID,
      googleAuthConfig.clientSecret,
      googleAuthConfig.redirectUri
    );
    this.authClient.setCredentials(tokens);

    this.drive = google.drive({
      version: "v3",
      auth: this.authClient,
    });
  }

  async refreshToken() {
    await this.authClient.refreshAccessToken();
    this.drive = google.drive({
      version: "v3",
      auth: this.authClient,
    });
  }

  async uploadFile(fileObject: any, folderId: string) {
    try {
      const bufferStream = new Stream.PassThrough();
      bufferStream.end(fileObject.buffer);
      // {
      //   fieldname: 'files',
      //   originalname: 'Screen Shot 2023-02-20 at 4.36.31 PM.png',
      //   encoding: '7bit',
      //   mimetype: 'image/png',
      //   buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 03 01 00 00 02 37 08 06 00 00 00 c3 4b 57 11 00 00 01 44 69 43 43 50 49 43 43 20 50 72 6f 66 69 ... 94728 more bytes>,
      //   size: 94778
      // }
      const response = await this.drive.files.create({
        requestBody: {
          name: hashObject(new Date()),
          mimeType: fileObject.mimetype,
          parents: [folderId],
        },
        media: {
          mimeType: fileObject.mimetype,
          body: bufferStream,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log("uploadFiel Error", error);
    }
  }

  async createFolder() {
    try {
      const file = await this.drive.files.create({
        requestBody: {
          name: "merlion-app",
          mimeType: "application/vnd.google-apps.folder",
        },
        fields: "id",
      });
      console.log("dir id", file.data.id);
      return file.data.id;
    } catch (err) {
      throw err;
    }
  }

  async listFile() {
    try {
      const res = await this.drive.files.list({
        pageSize: 10,
        fields: "nextPageToken, files(id, name)",
      });
      const files = res.data.files;
      console.log("Files:", files);
    } catch (error) {
      console.log("list Error", error);
    }
  }

  async delete(id: string) {
    try {
      const response = await this.drive.files.delete({
        fileId: id,
      });
      console.log(response.data, response.status);
    } catch (error) {
      console.log(error);
    }
  }

  async generatePublicUrl(id: string) {
    try {
      const fileId = id;
      console.log("generate public url", id);
      await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
      console.log("result public");
      const result = await this.drive.files.get({
        fileId: fileId,
        fields: "webViewLink, webContentLink, thumbnailLink",
      });
      console.log(result.data);
      return {
        webViewLink: result.data.webViewLink,
        webContentLink: result.data.webContentLink,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
