import { Response } from "express";
import userModel from "../model/user-model";
import { redis } from "../utils/redis";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  try {
    // check redis cache first
    const userJson = await redis.get(id);

    if (userJson) {
      const user = JSON.parse(userJson);
      return res.status(200).json({
        success: true,
        user,
      });
    }

    // if not in redis → get from DB
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // save to redis for caching
    await redis.set(id, JSON.stringify(user));

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All users
export const getAllUsersService = async ( res: Response) => {
    const users = await userModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
};

// update user role
export const updateUserRoleService = async (res: Response, id: string, role: string) => {
  const user = await userModel.findByIdAndUpdate(
    id,
    { role },
    { new: true } 
  );

  res.status(200).json({
    success: true,
    user,
  });
};


