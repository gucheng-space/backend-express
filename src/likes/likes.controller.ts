import { Request, Response, NextFunction } from "express";
import { createUserLikePost, deleteUserPost } from "./likes.service";
/**
 * 点赞内容
 */
export const storeUserLike = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id: userId } = request.user;
  const { postId } = request.params;

  try {
    const mes = await createUserLikePost(userId, parseInt(postId, 10));
    response.status(200).send(mes);
  } catch (error) {
    next(error);
  }
};

/**
 * 取消点赞
 */
export const destroyUserLikePost = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { postId } = request.params;
  const { id: usetId } = request.user;
  try {
    const mes = deleteUserPost(usetId, parseInt(postId, 10));
    response.status(200).send(mes);
  } catch (error) {
    next(error);
  }
};
