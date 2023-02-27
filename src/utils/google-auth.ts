import { google } from "googleapis";
import { googleAuthConfig } from "@src/config/oauth.js";

export class GoogleAuth {
  private oAuth2Client;

  constructor() {
    this.oAuth2Client = new google.auth.OAuth2(
      googleAuthConfig.clientID,
      googleAuthConfig.clientSecret,
      googleAuthConfig.redirectUri
    );
  }

  public getOAuth2Client() {
    return this.oAuth2Client;
  }

  public async refreshToken() {
    const tokens = await this.oAuth2Client.refreshAccessToken();
    console.log(tokens);
  }

  public getUrl(scopes: string[], callbackUrl: string) {
    try {
      const result = this.oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        state: callbackUrl,
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async getToken(code: string) {
    try {
      return await this.oAuth2Client.getToken(code);
    } catch (error) {
      throw error;
    }
  }

  public getOAuth2(tokens: any) {
    try {
      console.log("Token", tokens);
      this.oAuth2Client.setCredentials(tokens);
      console.log("AuthClient", this.oAuth2Client);
      // new google.auth.OAuth2({ version: "v2", auth: this.oAuth2Client });
      return google.oauth2({ version: "v2", auth: this.oAuth2Client });
    } catch (error) {
      throw error;
    }
  }
}
