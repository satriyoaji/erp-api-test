import { ObjectId } from "mongodb";
import { UserEntity } from "../entities/user.entity.js";
import { UserRepository } from "../repositories/user.repository.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";

interface InviteResponseInterface {
  _id: string;
  email: string;
  name: string;
  emailVerificaitonCode: string;
  acknowledge: boolean;
}

export class InviteUserService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(doc: DocumentInterface, options?: CreateOptionsInterface) {
    const userEntity = new UserEntity({
      email: doc.email,
      name: doc.name,
      role: doc.role,
    });

    await userEntity.generateRandomUsername();
    await userEntity.generateRandomPassword();
    userEntity.generateEmailValidationCode();

    const userRepository = new UserRepository(this.db);
    const createResponse = await userRepository.create(userEntity.user, options);
    const readResponse = await userRepository.read(createResponse._id, { session: options?.session });

    return {
      _id: createResponse._id,
      email: readResponse.email,
      name: readResponse.name,
      emailVerificaitonCode: readResponse.emailVerificaitonCode,
      acknowledge: createResponse.acknowledged,
    } as InviteResponseInterface;
  }
}
