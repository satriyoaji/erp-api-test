import { db } from "@src/database/database.js";
import { RoleInterface } from "@src/modules/roles/entities/role.entity.js";
import { RoleRepository } from "@src/modules/roles/repositories/role.repository.js";
import { hash } from "@src/utils/hash.js";

const roleRepository = new RoleRepository(db);
const result = await roleRepository.readMany({
  fields: "",
  filter: {},
  page: 1,
  pageSize: 1,
  sort: "",
});

const roles = result.data as unknown as Array<RoleInterface>;

const password = await hash("admin123");

export const usersSeed = [
  {
    username: "admin",
    email: "admin@example.com",
    password: password,
    name: "Admin",
    role_id: roles[0]._id,
  },
];
