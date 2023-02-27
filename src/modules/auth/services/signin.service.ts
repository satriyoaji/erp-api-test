import { ApiError } from "@point-hub/express-error-handler";
import { UserRepository } from "../repositories/user.repository.js";
import { issuer, secretKey } from "@src/config/auth.js";
import DatabaseConnection, { QueryInterface } from "@src/database/connection.js";
import { verify } from "@src/utils/hash.js";
import { generateRefreshToken, signNewToken } from "@src/utils/jwt.js";

export class SigninUserService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(username: string, password: string) {
    const query: QueryInterface = {
      fields: "",
      filter: { username: username },
      page: 1,
      pageSize: 1,
      sort: "",
    };

    const userRepository = new UserRepository(this.db);
    const result = (await userRepository.readMany(query)) as any;

    let isVerified = false;
    if (result.pagination.totalDocument === 1) {
      isVerified = await verify(result.data[0].password, password);
    }

    if (!isVerified) {
      throw new ApiError(401);
    }

    const accessToken = signNewToken(issuer, secretKey, result.data[0]._id);
    const refreshToken = generateRefreshToken(issuer, secretKey, result.data[0]._id);

    return {
      name: result.data[0].name,
      email: result.data[0].email,
      username: result.data[0].username,
      role: result.data[0].role,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
