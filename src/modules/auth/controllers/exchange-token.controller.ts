import { NextFunction, Request, Response } from "express";
import { ReadManyUserService } from "../services/read-many.service.js";
import { issuer, secretKey } from "@src/config/auth.js";
import { QueryInterface } from "@src/database/connection.js";
import { db } from "@src/database/database.js";
import { generateRefreshToken, signNewToken } from "@src/utils/jwt.js";

export const exchangeToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query: QueryInterface = {
      fields: (req.query.fields as string) ?? "",
      filter: {
        "oauthVerification.google": req.body.code,
      },
      page: Number(req.query.page ?? 1),
      pageSize: Number(req.query.limit ?? 10),
      sort: (req.query.sort as string) ?? "",
    };

    const readUserByEmailService = new ReadManyUserService(db);
    const result = await readUserByEmailService.handle(query);
    console.log(result);
    const accessToken = signNewToken(issuer, secretKey, result.data[0]._id.toString());
    const refreshToken = generateRefreshToken(issuer, secretKey, result.data[0]._id.toString());

    return res.json({
      name: result.data[0].name,
      email: result.data[0].email,
      username: result.data[0].username,
      role: result.data[0].role,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
