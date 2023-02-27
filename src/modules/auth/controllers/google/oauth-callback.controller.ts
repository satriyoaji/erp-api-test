import { NextFunction, Request, Response } from "express";
import { ReadUserByEmailService } from "../../services/read-user-by-email.service.js";
import { db } from "@src/database/database.js";
import { UpdateGoogleInfoService } from "@src/modules/auth/services/update-google-info.service.js";
import { GoogleAuth } from "@src/utils/google-auth.js";
import { hashObject } from "@src/utils/hash.js";

export const googleOauthCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    db.startTransaction();
    console.log(1);
    // Get userinfo from Google Auth
    const googleAuth = new GoogleAuth();
    const token = await googleAuth.getToken(req.query.code as string);
    console.log("1b", token);
    const oauth2 = googleAuth.getOAuth2(token.tokens);
    const userInfo = await oauth2.userinfo.get();
    // Check if email registered
    const readUserByEmailService = new ReadUserByEmailService(db);
    const result = await readUserByEmailService.handle(userInfo.data.email as string);
    let redirectUri = req.query.state as string;
    if (!result) {
      redirectUri += "?error=email address not found";
      return res.redirect(redirectUri);
    }
    // Generate verificaton code for frontend verified their token
    const verificationCode = hashObject({
      date: new Date(),
      email: userInfo.data.email,
    });
    redirectUri += `?code=${verificationCode}`;
    const updateService = new UpdateGoogleInfoService(db);
    await updateService.handle(
      result._id.toString(),
      {
        ...userInfo.data,
        verificationCode: verificationCode,
        tokens: token.tokens,
      },
      session
    );
    console.log(6);
    await db.commitTransaction();

    return res.redirect(redirectUri);
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
