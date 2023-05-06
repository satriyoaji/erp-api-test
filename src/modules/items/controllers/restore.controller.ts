import { NextFunction, Request, Response } from "express";
import { RestoreService } from "../services/restore.service.js";
import { db } from "@src/database/database.js";
import ApiError from "@point-hub/express-error-handler/lib/api-error";
import {VerifyTokenUserService} from "@src/modules/auth/services/verify-token.service";

export const restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = db.startSession();
        db.startTransaction();

        // const authorizationHeader = req.headers.authorization ?? "";
        // if (authorizationHeader === "") {
        //     throw new ApiError(401);
        // }
        // const verifyTokenUserService = new VerifyTokenUserService(db);
        // const authUser = await verifyTokenUserService.handle(authorizationHeader);
        // const found = authUser.permissions.includes("restore-item");
        // if (!found) {
        //     throw new ApiError(403);
        // }

        const archiveService = new RestoreService(db);
        await archiveService.handle(req.params.id, req.body, session);

        await db.commitTransaction();
        res.status(204).json({
            isArchived: false,
        });
    } catch (error) {
        await db.abortTransaction();
        next(error);
    } finally {
        await db.endSession();
    }
};