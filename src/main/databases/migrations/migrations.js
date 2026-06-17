import { PostMigration1775654571519 } from "./1775654571519-PostMigration.js";
import { UsersMigration1776048914144 } from "./1776048914144-UsersMigration.js";
import { AddRoleToUsers1776049000000 } from "./1776049000000-AddRoleToUsers.js";
import { AddUniqueConstraints1776049100000 } from "./1776049100000-AddUniqueConstraints.js";

export const migrations = [
  PostMigration1775654571519,
  UsersMigration1776048914144,
  AddRoleToUsers1776049000000,
  AddUniqueConstraints1776049100000,
];
