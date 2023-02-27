import DatabaseConnection, { QueryInterface } from "@src/database/connection.js";
import { UserRepository } from "@src/modules/users/repositories/user.repository.js";

export class ReadUserByEmailService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(email: string) {
    const query: QueryInterface = {
      fields: "",
      filter: { email: email },
      page: 1,
      pageSize: 1,
      sort: "",
    };

    console.log(query);

    const userRepository = new UserRepository(this.db);
    const result = await userRepository.readMany(query);

    return result.data[0];
  }
}
