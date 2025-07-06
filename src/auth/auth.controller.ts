import { Request, Response, NextFunction } from "express";
import { signToken } from "./auth.service";
import { request } from "http";

/**
 * 用户登录
 */
export const login = async (
  resquest: Request,
  response: Response,
  next: NextFunction
) => {
  const { id, name } = resquest.body.user;
  const token = signToken({ paylode: { id, name } });

  try {
    response.send({ id, name, token });
  } catch (error) {
    next(error);
  }
};

/**
 * 验证登录
 */
export const validate = (
  request: Request,
  reponse: Response,
  next: NextFunction
) => {
  reponse.sendStatus(200);
};
