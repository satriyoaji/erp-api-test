import { ItemRepository } from "../repositories/item.repository";
import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";

export class DestroyItemService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, options: DeleteOptionsInterface) {
    const itemRepository = new ItemRepository(this.db);
    return await itemRepository.delete(id, options);
  }
}