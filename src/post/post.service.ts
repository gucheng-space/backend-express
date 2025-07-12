import { createST } from "../../utils/createST";
import { pool } from "../app/database/postgresql";
import { PostModel } from "./post.model";
import { sqlFragment } from "./post.provider";

/**
 * 获取所有文章
 */
export interface GetPostsOptionsFilter {
  name?: string;
  sql?: string;
  param?: string;
}

export interface GetPostsOptionsPagination {
  limit: number;
  offset: number;
}

interface GetPostsOptions {
  sort?: string;
  filter?: GetPostsOptionsFilter;
  pagination?: GetPostsOptionsPagination;
}
export const getPosts = async (options: GetPostsOptions) => {
  const {
    sort,
    filter,
    pagination: { limit, offset },
  } = options;
  // 默认排序
  let params: Array<any> = [limit, offset];

  if (filter.param) {
    params = [filter.param, ...params];
  }
  const len = params.length;
  const statement = `
    SELECT
      post.id,
      post.title,
      post.content,
      ${sqlFragment.user},
      ${sqlFragment.totalComments},
      ${sqlFragment.totalLikes},
      ${sqlFragment.files},
      ${sqlFragment.tags}
    FROM post
    ${filter.name == "userLiked" ? sqlFragment.innerJoinUserLikePost : ""}
    WHERE ${filter.sql}
    ORDER BY ${sort}
    LIMIT $${len - 1}
    OFFSET $${len}
  `;
  const { rows } = await pool.query(statement, params);
  return rows;
};

/**
 * 创建内容
 */
export const createPost = async (post: PostModel) => {
  const statement = `
  INSERT INTO post (title,content,userId)
   VALUES ($1,$2,$3)
   RETURNING *
  `;
  const { rows } = await pool.query(statement, [
    post.title,
    post.content,
    post.userId,
  ]);
  return rows;
};

/**
 * 更新文章
 */
export const updatePost = async (postId: number, post: PostModel) => {
  const { setClause, values, len } = createST({ obj: post, options: "UPDATE" });
  const statement = `
    UPDATE post
    SET ${setClause}
    WHERE id = $${len + 1}
    RETURNING *
  `;
  const { rows } = await pool.query(statement, [...values, postId]);
  return rows;
};

/**
 * 删除文章
 */
export const deletePost = async (postId: number) => {
  const statement = `
    DELETE FROM post 
    WHERE id = $1
    RETURNING *
  `;
  const { rows } = await pool.query(statement, [postId]);
  return rows;
};
/**
 * 保存内容标签
 */
export const createPostTag = async (postId: number, tagId: number) => {
  const statement = `
    INSERT INTO post_tag(postid,tagid)
    VALUES($1,$2) 
    RETURNING *
  `;
  const { rows } = await pool.query(statement, [postId, tagId]);
  return rows[0];
};
/**
 * 查询内容标签
 */
export const postHasTag = async (postId: number, tagId: number) => {
  const statement = `
    SELECT * FROM post_tag
    WHERE postid = $1 AND tagid = $2
  `;
  const { rows } = await pool.query(statement, [postId, tagId]);
  return rows[0] ? true : false;
};

/**
 * 删除内容标签
 */
export const deletePostTag = async (postId: number, tagId: number) => {
  const statement = `
    DELETE FROM post_tag
    WHERE postid = $1 AND tagid = $2
    RETURNING *
  `;
  const { rows } = await pool.query(statement, [postId, tagId]);
  return rows[0];
};

/**
 * 统计内容数量
 */
export const getPostsTotalCount = async (options: GetPostsOptions) => {
  const { filter } = options;

  const params = filter.param ? [filter.param] : [];
  const statement = `
    SELECT 
      COUNT(DISTINCT post.id) as total
    FROM post
      ${filter.name == "userLiked" ? sqlFragment.innerJoinUserLikePost : ""}
    WHERE ${filter.sql}
  `;
  const { rows } = await pool.query(statement, params);
  return rows[0];
};
