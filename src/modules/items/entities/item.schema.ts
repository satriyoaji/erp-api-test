import { IDatabaseAdapter } from "@src/database/connection";

export const name = "item";

export const restrictedFields = [];

const isExists = async (db: IDatabaseAdapter) => {
  const collections = (await db.listCollections()) as [];
  return collections.some(function (el: any) {
    return el.name === name;
  });
};

export async function createCollection(db: IDatabaseAdapter) {
  try {
    if (!(await isExists(db))) {
      await db.createCollection(name);
    }

    await db.updateSchema(name, {
      bsonType: "object",
      required: ["name"],
      properties: {
        createdAt: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        updatedAt: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        createdBy: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        updatedBy: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        code: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        name: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        chartOfAccount: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        hasProductionNumber: {
          bsonType: "boolean",
          description: "must be a boolean and is required",
        },
        hasExpiryDate: {
          bsonType: "boolean",
          description: "must be a boolean and is required",
        },
        unit: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        isArchived: {
          bsonType: "bool",
          description: "must be a bool and is required",
        },
        converter: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              name: {
                bsonType: "string",
                description: "must be a string and is required",
              },
              multiply: {
                bsonType: "number",
                description: "must be a string and is required",
              },
            },
          },
        },
      },
    });
    await db.createIndex(
        name,
        { name: -1 },
        {
          unique: true,
          collation: {
            locale: "en",
            strength: 2,
          },
        }
    );
  } catch (error) {
    throw error;
  }
}

export async function dropCollection(db: IDatabaseAdapter) {
  try {
    if (await isExists(db)) {
      await db.dropCollection(name);
    }
  } catch (error) {
    throw error;
  }
}