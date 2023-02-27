import { IDatabaseAdapter } from "@src/database/connection";

export const name = "users";

export const restrictedFields = ["password"];

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
      required: ["name", "email", "password", "role"],
      properties: {
        createdAt: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        invitedAt: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        updatedAt: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        lastOnline: {
          bsonType: "date",
          description: "must be a date",
        },
        lastIp: {
          bsonType: "string",
          description: "must be a string",
        },
        username: {
          bsonType: "string",
          minLength: 3,
          maxLength: 30,
          description: "must be a string and is required",
        },
        email: {
          bsonType: "string",
          minLength: 4,
          description: "must be a string and is required",
        },
        emailVerificationCode: {
          bsonType: "string",
          description: "must be a string",
        },
        isEmailVerified: {
          bsonType: "bool",
          description: "must be a boolean",
        },
        password: {
          bsonType: "string",
          minLength: 8,
          maxLength: 255,
          description: "must be a string and is required",
        },
        name: {
          bsonType: "string",
          description: "must be a string",
        },
        role: {
          bsonType: "string",
          enum: ["user", "admin"],
          description: "must be a string",
        },
        isActive: {
          bsonType: "bool",
          description: "must be a boolean and is required",
        },
        tokens: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["accessToken", "refreshToken", "expiresAt", "issuer", "audience"],
            properties: {
              createdAt: {
                bsonType: "date",
                description: "must be a date and is required",
              },
              accessToken: {
                bsonType: "string",
                description: "must be a string and is required",
              },
              accessTokenExpiresAt: {
                bsonType: "date",
                description: "must be a date and is required",
              },
              refreshToken: {
                bsonType: "string",
                description: "must be a string and is required",
              },
              refreshTokenExpiresAt: {
                bsonType: "date",
                description: "must be a date and is required",
              },
              issuer: {
                bsonType: "string",
                description: "must be a string and is required",
              },
              audience: {
                bsonType: "string",
                description: "must be a string and is required",
              },
            },
          },
        },
      },
    });
    await db.createIndex(
      name,
      { username: -1 },
      {
        unique: true,
        collation: {
          locale: "en",
          strength: 2,
        },
      }
    );
    await db.createIndex(
      name,
      { email: -1 },
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
