import { ipcMain } from "electron";
import datasource from "../databases/datasource.js";
import { Post } from "../databases/entities/post.entity.js";

export const postController = () => {
  ipcMain.handle("get-posts", async () => {
    const repository = datasource.getRepository(Post);
    return await repository.find();
  });

  ipcMain.handle("create-post", async (_, data) => {
    try {
      const repository = datasource.getRepository(Post);
      return await repository.save(data);
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("Title already exists. Please use a unique title.");
      }
      throw error;
    }
  });

  ipcMain.handle("update-post", async (_, data) => {
    try {
      const repository = datasource.getRepository(Post);
      return await repository.update(data.id, data);
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("Title already exists. Please use a unique title.");
      }
      throw error;
    }
  });

  ipcMain.handle("delete-post", async (_, data) => {
    const repository = datasource.getRepository(Post);
    return await repository.delete(data.id);
  });
};
