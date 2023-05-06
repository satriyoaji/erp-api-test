import { ItemInterface } from "../entities/item.entity.js";
import { ItemRepository } from "../repositories/item.repository.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class RestoreService {
    private db: DatabaseConnection;
    constructor(db: DatabaseConnection) {
        this.db = db;
    }
    public async handle(id: string, doc: DocumentInterface, session: unknown) {
        const itemRepository = new ItemRepository(this.db);
        const item = (await itemRepository.read(id, { session })) as unknown as ItemInterface;
        item.isArchived = false;
        return await itemRepository.update(id, item, { session });
    }
}