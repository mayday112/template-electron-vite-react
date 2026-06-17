import { ipcRenderer } from "electron";

export const authBridge = {
  checkLogin: (data) => ipcRenderer.invoke("check-login", data),
  logout: () => ipcRenderer.invoke("logout"),
  checkUser: () => ipcRenderer.invoke("check-user"),
};
