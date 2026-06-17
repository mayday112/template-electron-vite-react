import { contextBridge } from "electron";
import { authBridge } from "./bridges/auth.bridge.js";
import { postBridge } from "./bridges/post.bridge.js";
import { userBridge } from "./bridges/user.bridge.js";

contextBridge.exposeInMainWorld("api", {
  ...authBridge,
  ...postBridge,
  ...userBridge,
});
