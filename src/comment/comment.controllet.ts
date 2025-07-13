import e, { Request, Response, NextFunction } from "express";
import { CommentModel } from "./comment.model";
import {
  createComment,
  isReplyComment,
  updateComment,
  deleteComment,
  getComments,
  getCommentsTotalCount,
  getCommentReplies,
} from "./comment.service";

/**
 * 发表评论
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { content, postId } = request.body;
  const { id } = request.user;
  //定义数据
  const comment: CommentModel = { content, postid: postId, userid: id };
  try {
    const mes = await createComment(comment);
    response.status(201).send(mes);
  } catch (error) {
    next(error);
  }
};

/**
 * 回复评论
 */
export const reply = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { content, postId } = request.body;
  const { commentId } = request.params;
  const { id } = request.user;
  const comment: CommentModel = {
    content,
    postid: postId,
    userid: id,
    parentid: parseInt(commentId, 10),
  };

  try {
    const isReply = await isReplyComment(parseInt(commentId, 10));

    if (isReply) throw new Error("UNABLE_TO_REPLY_THIS_COMMENT");
  } catch (error) {
    return next(error);
  }
  try {
    const mes = await createComment(comment);
    response.status(201).send(mes);
  } catch (error) {
    next(error);
  }
};

/**
 * 修改评论
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { content } = request.body;
  const { commentId } = request.params;
  try {
    const mes = await updateComment({ id: parseInt(commentId, 10), content });
    response.status(200).send(mes);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除评论
 */
export const destroy = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { commentId } = request.params;
  try {
    const mes = await deleteComment(parseInt(commentId, 10));
    response.status(200).send(mes);
  } catch (error) {
    next(error);
  }
};

/**
 * 评论列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const totalCount = await getCommentsTotalCount({ filter: request._filter });

    response.header("X-Total-Count", totalCount["total"]);
  } catch (error) {
    next(error);
  }

  try {
    const comments = await getComments({
      filter: request._filter,
      pagination: request.pagination,
    });
    response.status(200).send(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * 回复列表
 */
export const indexReplies = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { commentId } = request.params;

  try {
    const mes = await getCommentReplies({ commentId: parseInt(commentId, 10) });
    response.status(200).send(mes);
  } catch (error) {
    next(error);
  }
};
