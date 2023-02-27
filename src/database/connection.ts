import { fileSearch } from "@point-hub/express-utils";
import { ObjectId } from "mongodb";

export interface DocumentInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface FilterInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface QueryInterface {
  fields: string;
  restrictedFields?: string[];
  filter: FilterInterface;
  page: number;
  pageSize: number;
  sort: string;
}

export interface CreateOptionsInterface {
  session: unknown;
}

export interface ReadOptionsInterface {
  projection?: unknown;
  session?: unknown;
}

export interface ReadManyOptionsInterface {
  session: unknown;
}

export interface UpdateOptionsInterface {
  session: unknown;
}

export interface DeleteOptionsInterface {
  session: unknown;
}

export interface AggregrateOptionsInterface {
  session: unknown;
}

export interface CreateResultInterface {
  _id: string;
  acknowledged: boolean;
}

export interface ReadResultInterface {
  _id: ObjectId;
  [key: string]: unknown;
}

export interface ReadManyResultInterface {
  data: Array<ReadResultInterface>;
  pagination: {
    page: number;
    pageCount: number;
    pageSize: number;
    totalDocument: number;
  };
}

export interface UpdateResultInterface {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: ObjectId | string | null;
  upsertedCount: number;
  matchedCount: number;
}

export interface DeleteResultInterface {
  acknowledged: boolean;
  deletedCount: number;
}

export interface IDatabaseAdapter {
  session: unknown;
  url(): string;
  open(): Promise<void>;
  close(): Promise<void>;
  database(name: string, options?: unknown): this;
  listCollections(): Promise<unknown>;
  collection(name: string, options?: unknown): this;
  createIndex(name: string, spec: unknown, options?: unknown): Promise<unknown>;
  createCollection(name: string, options?: unknown): Promise<unknown>;
  dropCollection(name: string, options?: unknown): Promise<unknown>;
  updateSchema(name: string, schema: unknown): Promise<unknown>;
  startSession(): unknown;
  endSession(): Promise<this>;
  startTransaction(): this;
  commitTransaction(): Promise<this>;
  abortTransaction(): Promise<this>;
  create(doc: DocumentInterface, options?: CreateOptionsInterface): Promise<CreateResultInterface>;
  createMany(doc: DocumentInterface, options?: CreateOptionsInterface): Promise<unknown>;
  read(id: string, options?: ReadOptionsInterface): Promise<ReadResultInterface>;
  readMany(query: QueryInterface, options?: ReadManyOptionsInterface): Promise<ReadManyResultInterface>;
  update(id: string, doc: DocumentInterface, options?: UpdateOptionsInterface): Promise<UpdateResultInterface>;
  delete(id: string, options?: DeleteOptionsInterface): Promise<DeleteResultInterface>;
  deleteMany(id: string, options?: DeleteOptionsInterface): Promise<unknown>;
  deleteAll(options?: DeleteOptionsInterface): Promise<unknown>;
  aggregate(pipeline: any, query: any, options?: AggregrateOptionsInterface): Promise<unknown>;
}

export default class DatabaseConnection {
  private adapter: IDatabaseAdapter;

  constructor(adapter: IDatabaseAdapter) {
    this.adapter = adapter;
  }

  public url(): string {
    return this.adapter.url();
  }

  public async open(): Promise<void> {
    await this.adapter.open();
  }

  public async close(): Promise<void> {
    await this.adapter.close();
  }

  public database(name: string): this {
    this.adapter.database(name);
    return this;
  }

  public listCollections(): any {
    return this.adapter.listCollections();
  }

  public collection(name: string): this {
    this.adapter.collection(name);
    return this;
  }

  public startSession() {
    this.adapter.startSession();
    return this.adapter.session;
  }

  public async endSession() {
    await this.adapter.endSession();
    return this;
  }

  public startTransaction() {
    this.adapter.startTransaction();
    return this;
  }

  public async commitTransaction() {
    await this.adapter.commitTransaction();
    return this;
  }

  public async abortTransaction() {
    await this.adapter.abortTransaction();
    return this;
  }

  public async create(doc: DocumentInterface, options?: CreateOptionsInterface): Promise<CreateResultInterface> {
    return await this.adapter.create(doc, options);
  }

  public async createMany(docs: DocumentInterface[], options?: CreateOptionsInterface): Promise<unknown> {
    return await this.adapter.createMany(docs, options);
  }

  public async read(id: string, options?: ReadOptionsInterface): Promise<ReadResultInterface> {
    return await this.adapter.read(id, options);
  }

  public async readMany(query: QueryInterface, options?: ReadManyOptionsInterface): Promise<ReadManyResultInterface> {
    return await this.adapter.readMany(query, options);
  }

  public async update(
    id: string,
    doc: DocumentInterface,
    options?: UpdateOptionsInterface
  ): Promise<UpdateResultInterface> {
    return await this.adapter.update(id, doc, options);
  }

  public async delete(id: string, options?: DeleteOptionsInterface): Promise<DeleteResultInterface> {
    return await this.adapter.delete(id, options);
  }

  public async deleteAll(options?: DeleteOptionsInterface): Promise<unknown> {
    return await this.adapter.deleteAll(options);
  }

  public async aggregate(pipeline: any, query?: any): Promise<unknown> {
    return await this.adapter.aggregate(pipeline, query);
  }

  public createIndex(name: string, spec: unknown, options?: unknown) {
    this.adapter.createIndex(name, spec, options);
  }

  public async createCollection(name: string, options?: unknown) {
    this.adapter.createCollection(name, options);
  }

  public async dropCollection(name: string, options?: unknown) {
    this.adapter.dropCollection(name, options);
  }

  public async updateSchema(name: string, schema: unknown) {
    this.adapter.updateSchema(name, schema);
  }

  /**
   * Create Collections
   * ==================
   * Create new collection if not exists and update schema validation or indexes
   */
  public async createCollections() {
    const object = await fileSearch("/*.schema.ts", "./src/modules", { maxDeep: 2, regExp: true });
    for (const property in object) {
      const path = `../modules/${object[property].path.replace("\\", "/").replace(".ts", ".js")}`;
      const { createCollection } = await import(path);
      await createCollection(this);
    }
  }

  /**
   * Drop Collections
   * ==================
   * Drop collections function is for testing purpose, so every test can generate fresh database
   */
  public async dropCollections() {
    const object = await fileSearch("/*.schema.ts", "./src/modules", { maxDeep: 2, regExp: true });
    for (const property in object) {
      const path = `../modules/${object[property].path.replace("\\", "/").replace(".ts", ".js")}`;
      const { dropCollection } = await import(path);
      await dropCollection(this);
    }
  }
}
