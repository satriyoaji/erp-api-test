import { ApiError } from "@point-hub/express-error-handler";
import { secretKey } from "@src/config/auth.js";
import DatabaseConnection from "@src/database/connection.js";
import { UserInterface } from "@src/modules/users/entities/user.entity";
import { ReadUserService } from "@src/modules/users/services/read.service.js";
import { verifyToken } from "@src/utils/jwt.js";

export class VerifyTokenUserService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(token: string) {
    const result: any = verifyToken(token.split(" ")[1], secretKey);

    // token invalid
    if (!result) {
      throw new ApiError(401);
    }

    // token expired
    if (new Date() > result.exp) {
      throw new ApiError(401);
    }

    const readUserService = new ReadUserService(this.db);
    const user: UserInterface = (await readUserService.handle(result.sub, {
      restrictedFields: ["password"],
    })) as UserInterface;

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      googleDriveId: user.googleDriveId,
      oauth: user.oauth,
    };
  }
}
