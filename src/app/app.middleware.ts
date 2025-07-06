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
  switch (error.message) {
    case "NAME_IS_REQUIRED":
      statusCode = 400;
      message = "请输入用户名";
      break;
    case "PASSWORD_IS_REQUIRED":
      statusCode = 400;
      message = "请输入密码";
      break;
    case "USER_ALREADY_EXIST":
      statusCode = 409;
      message = "这名字被人用了";
      break;
    case "USER_DOES_NOT_EXIST":
      statusCode = 400;
      message = "无此用户";
      break;
    case "PASSWORD_DOES_NOT_MATCH":
      statusCode = 400;
      message = "密码错误 🙅‍";
      break;
    default:
      statusCode = 500;
      message = "服务器暂时出了点问题 O.o";
      break;
  }
  response.status(statusCode).send({ message });
};
