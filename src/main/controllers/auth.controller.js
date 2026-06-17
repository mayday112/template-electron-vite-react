import { ipcMain } from "electron";
import datasource from "../databases/datasource.js";
import { User } from "../databases/entities/user.entity.js";
import bcrypt from "bcryptjs";
import Store from "electron-store";

const store = new Store();

export const authController = () => {
  ipcMain.handle("check-user", () => {
    const user = store.get("user");
    if (!user) {
      return false;
    }
    return user;
  });

  ipcMain.handle("check-login", async (_, data) => {
    const repository = datasource.getRepository(User);
    const user = await repository.findOne({ where: { email: data.email } });
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password,
      );
      if (isPasswordValid) {
        store.set("user", user);
        return true;
      }
      return false;
    }
    return false;
  });

  ipcMain.handle("logout", async () => {
    store.delete("user");
    return true;
  });
};
