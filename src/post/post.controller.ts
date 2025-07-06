import { Request, Response, NextFunction } from "express";
import { getPosts, createPost, updatePost, deletePost } from "./post.service";
import _ from "lodash";

/**
 * 内容列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const posts = await getPosts();
    response.send(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * 创建内容
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = request.user;
    const { title, content } = request.body;
    const post = await createPost({ title, content, userId });
    response.status(201).send(post);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新文章
 */
export const upodate = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { postId } = request.params;
    const post = _.pick(request.body, ["title", "content"]);
    const mes = await updatePost(parseInt(postId, 10), post);
    response.send(mes);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除文章
 */
export const destroy = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { postId } = request.params;
    const mes = await deletePost(parseInt(postId, 10));
    response.send(mes);
  } catch (error) {
    next(error);
  }
};
