import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";

/**
 * 用户登录
 */
export const login = async (
  resquest: Request,
  response: Response,
  next: NextFunction
) => {
  const { name, password } = resquest.body;

  try {
    response.send({ message: `欢迎回来${name}` });
  } catch (error) {
    next(error);
  }
};
