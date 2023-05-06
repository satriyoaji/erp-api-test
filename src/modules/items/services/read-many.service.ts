import DatabaseConnection, { QueryInterface } from "@src/database/connection.js";
import { ItemInterface } from "../entities/item.entity.js";
import { ItemRepository } from "../repositories/item.repository.js";

export class ReadManyItemService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(query: QueryInterface) {
    const itemRepository = new ItemRepository(this.db);
    const result = await itemRepository.readMany(query);

    return {
      items: result.data as unknown as Array<ItemInterface>,
      pagination: result.pagination,
    };
  }
}