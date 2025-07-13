import { Request, Response, NextFunction } from "express";

/**
 * 过滤器
 */
export const filter = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { post, user, action } = request.query;

  request._filter = {
    name: "default",
    sql: "comment.parentid IS NULL",
  };

  if (post && !user && !action) {
    request._filter = {
      name: "postComments",
      sql: "comment.parentid IS NULL AND comment.postid = $1",
      param: post as string,
    };
  }

  if (user && action == "published" && !post) {
    request._filter = {
      name: "userPublished",
      sql: "comment.parentid IS NULL AND comment.userid = $1",
      param: user as string,
    };
  }

  if (user && action == "replied" && !post) {
    request._filter = {
      name: "userReplied",
      sql: "comment.parentid IS NOT NULL AND comment.userid = $1",
      param: user as string,
    };
  }

  next();
};

/**
 * 内容分页
 */
export const paginate = (itemsPerPage: number) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const { page = 1 } = request.query;

    const limit = itemsPerPage || 30;

    const offset = limit * ((page as number) - 1);

    request.pagination = {
      limit,
      offset,
    };

    next();
  };
};
