import { ItemEntity } from "../entities/item.entity";
import { ItemRepository } from "../repositories/item.repository";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class UpdateItemService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const itemEntity = new ItemEntity({
      code: doc.code,
      name: doc.name,
      chartOfAccount: doc.chartOfAccount,
      isArchived: false,
      hasProductionNumber: doc.hasProductionNumber,
      hasExpiryDate: doc.hasExpiryDate,
      unit: doc.unit,
      converter: doc.converter,
    });

    const itemRepository = new ItemRepository(this.db);
    return await itemRepository.update(id, itemEntity.item, { session });
  }
}