import { Request, Response, NextFunction } from "express";
/**
 * 排序方式
 */
export const sort = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { sort } = request.query;

  let sqlSort: string;

  switch (sort) {
    case "earliest":
      sqlSort = "post.id ASC";
      break;
    case "latest":
      sqlSort = "post.id DESC";
      break;
    case "most_comments":
      sqlSort = "totalComments DESC, post.id DESC";
      break;
    default:
      sqlSort = "post.id DESC";
      break;
  }

  request.sort = sqlSort;
  next();
};

/**
 * 过滤列表
 */
export const filter = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { tag, user, action } = request.query;

  request._filter = {
    name: "default",
    sql: "post.id IS NOT NULL",
  };

  if (tag && !user && !action) {
    request._filter = {
      name: "tagName",
      sql: `EXISTS (
              SELECT 1 FROM post_tag
              JOIN tag ON post_tag.tagid = tag.id
              WHERE post_tag.postid = post.id
              AND tag.name = $1
            )`,
      param: tag as string,
    };
  }

  if (user && action === "published" && !tag) {
    request._filter = {
      name: "userPublished",
      sql: `post.userid = $1`,
      param: user as string,
    };
  }

  //过滤出用户赞过的内容
  if (user && action === "liked" && !tag) {
    request._filter = {
      name: "userLiked",
      sql: `user_like_post.userid = $1`,
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
