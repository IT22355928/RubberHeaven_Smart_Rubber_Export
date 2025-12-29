import express from "express";
import {
  activateUser,
  loginUser,
  logoutUser,
  registrationUser,
  updateAccessToken,
  getUserInfo,
  socialAuth,
  updateUserInfo,
  updatePassword,
  updateProfilePicture,
  getAllUsers,
  updateUserRole,
  deleteUser
} from "../controllers/user-controller";

import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const userRouter = express.Router();

// Routes
userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);

userRouter.get("/logout", isAuthenticated, logoutUser);

userRouter.get("/refreshtoken", updateAccessToken);

userRouter.get("/me", isAuthenticated, getUserInfo);

userRouter.post("/social-auth", socialAuth);

userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);
userRouter.put("/update-user-password", isAuthenticated, updatePassword);
userRouter.put("/update-user-avatar", isAuthenticated, updateProfilePicture);


// Admin Route - Get All Users
userRouter.get(
  "/get-users", 
  isAuthenticated, 
  authorizeRoles("admin"), 
  getAllUsers
);

userRouter.put(
  "/update-user", 
  isAuthenticated, 
  authorizeRoles("admin"), 
  updateUserRole
);

userRouter.delete(
   "/delete-user/:id",
  isAuthenticated, 
  authorizeRoles("admin"), 
  deleteUser
);


export default userRouter;
