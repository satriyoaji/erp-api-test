import { NextFunction, Request, Response } from "express";
import { GoogleAuth } from "@src/utils/google-auth.js";

export const googleDriveGetAuthUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const callbackUrl = req.query.callback as string;
    const googleAuth = new GoogleAuth();
    const url = googleAuth.getUrl(
      [
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      callbackUrl
    );

    return res.status(200).json(url);
  } catch (error) {
    next(error);
  }
};
