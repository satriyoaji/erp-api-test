import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { NextFunction, Request, Response } from "express";
import { QueryInterface } from "@src/database/connection.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";
import { ItemInterface } from "@src/modules/items/entities/item.entity.js";
import { ReadManyItemService } from "@src/modules/items/services/read-many.service.js";

export interface PaginationInterface {
    page: number;
    pageCount: number;
    pageSize: number;
    totalDocument: number;
}

export interface ResponseInterface {
    data: Array<ItemInterface>;
    pagination: PaginationInterface;
}

export const readMany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization ?? "";
        const readManyRoleService = new ReadManyItemService(db);
        const tokenService = new VerifyTokenUserService(db);
        if (authorizationHeader === "") {
            throw new ApiError(401);
        }

        const authUser = await tokenService.handle(authorizationHeader);

        // const found = authUser.permissions.includes("read-item");
        // if (!found) {
        //     throw new ApiError(403);
        // }
        const iQuery: QueryInterface = {
            fields: (req.query.field as string) ?? "",
            filter: (req.query.filter as any) ?? {},
            page: Number(req.query.page ?? 1),
            pageSize: Number(req.query.pageSize ?? 10),
            sort: (req.query.sort as string) ?? "",
        };

        const result = await readManyRoleService.handle(iQuery);

        const pagination: PaginationInterface = {
            page: result.pagination.page,
            pageSize: result.pagination.pageSize,
            pageCount: result.pagination.pageCount,
            totalDocument: result.pagination.totalDocument,
        };

        const response: ResponseInterface = {
            data: result.items,
            pagination: pagination,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};