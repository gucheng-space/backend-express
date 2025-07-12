import { Request, Response, NextFunction } from "express";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  postHasTag,
  createPostTag,
  deletePostTag,
  getPostsTotalCount,
} from "./post.service";
import _ from "lodash";
import { TagModel } from "../tag/tag.model";
import { createTag, getTagByName } from "../tag/tag.service";

/**
 * 内容列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const totalCount = await getPostsTotalCount({ filter: request._filter });
    response.header("X-Total-Count", totalCount.total);
  } catch (error) {
    next(error);
  }

  try {
    const posts = await getPosts({
      sort: request.sort,
      filter: request._filter,
      pagination: request.pagination,
    });
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

/**
 * 添加内容标签
 */
export const storePostTag = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { postId } = request.params;
  const { name } = request.body;

  let tag: TagModel;

  try {
    tag = await getTagByName(name);
  } catch (error) {
    return next(error);
  }

  if (tag) {
    try {
      const postTag = await postHasTag(parseInt(postId, 10), tag.id);
      if (postTag) throw new Error("POST_ALREADY_HAS_TAG");
    } catch (error) {
      return next(error);
    }
  }
  if (!tag) {
    try {
      tag = await createTag({ name });
    } catch (error) {
      return next(error);
    }
  }
  try {
    await createPostTag(parseInt(postId, 10), tag.id);
    response.status(201).send();
  } catch (error) {
    return next(error);
  }
};
/**
 * 删除内容标签
 */
export const destroyPostTag = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { postId } = request.params;
  const { tagId } = request.body;

  try {
    await deletePostTag(parseInt(postId, 10), parseInt(tagId, 10));
    response.status(200).send();
  } catch (error) {
    next(error);
  }
};
