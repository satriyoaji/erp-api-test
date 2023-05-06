import { NextFunction, Request, Response } from "express";
import { ArchiveService } from "../services/archive.service";
import { db } from "@src/database/database.js";

export const archive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = db.startSession();

        db.startTransaction();

        const archiveService = new ArchiveService(db);
        await archiveService.handle(req.params.id, req.body, session);

        await db.commitTransaction();
        res.status(204).json({
            isArchived: true,
        });
    } catch (error) {
        await db.abortTransaction();
        next(error);
    } finally {
        await db.endSession();
    }
};