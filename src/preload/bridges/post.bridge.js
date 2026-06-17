import { ipcRenderer } from "electron";

export const postBridge = {
  getPosts: () => ipcRenderer.invoke("get-posts"),
  createPost: (data) => ipcRenderer.invoke("create-post", data),
  updatePost: (data) => ipcRenderer.invoke("update-post", data),
  deletePost: (data) => ipcRenderer.invoke("delete-post", data),
};
