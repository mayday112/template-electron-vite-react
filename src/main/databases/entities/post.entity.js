import { EntitySchema } from "typeorm";

export const Post = new EntitySchema({
  name: "Post",
  tableName: "posts",
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    title: { type: "varchar", unique: true },
    content: { type: "text" },
  },
});
