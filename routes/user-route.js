import express from "express";
import {
  getAllUsers,
  getCustomer,
  getUser,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/profile", getUserProfile);
userRouter.get("/customer/:id", getCustomer);

userRouter.put("/profile/update", updateUser);
userRouter.put("/logout", logoutUser);

userRouter.get("/getUser/:id", getUser);
userRouter.get("/getAllUsers", getAllUsers);

export default userRouter;
