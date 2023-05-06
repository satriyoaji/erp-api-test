import { NextFunction, Request, Response } from "express";
import { ItemInterface } from "../entities/item.entity";
import { ReadItemService } from "../services/read.service";
import { db } from "@src/database/database.js";

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readItemService = new ReadItemService(db);
    const result = (await readItemService.handle(req.params.id)) as ItemInterface;

    console.log(result);
    res.status(200).json({
      _id: result._id,
      name: result.name,
      chartOfAccount: result.chartOfAccount,
      hasProductionNumber: result.hasProductionNumber,
      hasExpiryDate: result.hasExpiryDate,
      unit: result.unit,
      converter: result.converter,
    });
  } catch (error) {
    next(error);
  }
};