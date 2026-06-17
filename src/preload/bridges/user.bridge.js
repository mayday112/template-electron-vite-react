import { ipcRenderer } from "electron";

export const userBridge = {
  getUsers: () => ipcRenderer.invoke("get-users"),
  createUser: (data) => ipcRenderer.invoke("create-user", data),
  updateUser: (data) => ipcRenderer.invoke("update-user", data),
  deleteUser: (data) => ipcRenderer.invoke("delete-user", data),
};
