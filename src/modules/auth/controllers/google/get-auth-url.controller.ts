import { NextFunction, Request, Response } from "express";
import { GoogleAuth } from "@src/utils/google-auth.js";

export const googleGetAuthUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const googleAuth = new GoogleAuth();
    const callbackUrl = req.query.callback as string;
    const url = googleAuth.getUrl(
      [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/drive.file",
      ],
      callbackUrl
    );

    return res.status(200).json(url);
  } catch (error) {
    next(error);
  }
};
