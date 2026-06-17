import { ipcMain } from "electron";
import datasource from "../databases/datasource.js";
import { User } from "../databases/entities/user.entity.js";
import bcrypt from "bcryptjs";

export const userController = () => {
  ipcMain.handle("get-users", async () => {
    const repository = datasource.getRepository(User);
    return await repository.find();
  });

  ipcMain.handle("create-user", async (_, data) => {
    try {
      const repository = datasource.getRepository(User);
      const hashPassword = await bcrypt.hash(data.password, 10);
      const userData = { ...data, password: hashPassword };
      if (!userData.id) delete userData.id;
      return await repository.save(userData);
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("Email already exists. Please use a unique email.");
      }
      throw error;
    }
  });

  ipcMain.handle("update-user", async (_, data) => {
    try {
      const repository = datasource.getRepository(User);
      const updateData = { ...data };
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
      } else {
        delete updateData.password;
      }
      return await repository.update(data.id, updateData);
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("Email already exists. Please use a unique email.");
      }
      throw error;
    }
  });

  ipcMain.handle("delete-user", async (_, data) => {
    const repository = datasource.getRepository(User);
    return await repository.delete(data.id);
  });
};
