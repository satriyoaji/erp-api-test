import { hash } from "@src/utils/hash.js";

const password = await hash("admin123");

export const usersSeed = [
  {
    username: "admin",
    email: "admin@example.com",
    password: password,
    name: "Admin",
    role: "admin",
  },
];
