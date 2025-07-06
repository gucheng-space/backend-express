import { Request, Response, NextFunction } from "express";

/**
 * 输出请求地址
 */
export const requestUrl = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(`请求地址: ${request.url}`);
  next();
};

/**
 * 默认异常处理
 */
export const defaultErrorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error.message) {
    console.log(" 🔧 ", error.message);
  }
  let statusCode: number, message: string;
  switch (error.name) {
    default:
      statusCode = 500;
      message = "服务器暂时出了点问题 O.o";
      break;
  }
  response.status(statusCode).send({ message });
};
