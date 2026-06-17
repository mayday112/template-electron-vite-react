import { authController } from "./auth.controller.js";
import { postController } from "./post.controller.js";
import { userController } from "./user.controller.js";

export const registerControllers = () => {
  authController();
  postController();
  userController();
};
