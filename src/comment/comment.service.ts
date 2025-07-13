import { pool } from "../app/database/postgresql";
import { CommentModel } from "./comment.model";
import { createST } from "../../utils/createST";
import { sqlFragment } from "./comment.provider";
import {
  GetPostsOptionsFilter,
  GetPostsOptionsPagination,
} from "../post/post.service";

/**
 * 创建评论
 */
export const createComment = async (comment: CommentModel) => {
  const { setClause, values } = createST({ obj: comment, options: "INSERT" });
  const statement = `
    INSERT INTO "comment"(${setClause})
    VALUES (${values.map((_, i) => `$${i + 1}`).join(",")})
    RETURNING *
  `;
  const { rows } = await pool.query(statement, [...values]);
  return rows;
};

/**
 * 检查评论是否为回复评论
 */
export const isReplyComment = async (commentId: number) => {
  const statement = `
        SELECT parentid FROM "comment"
        WHERE id = $1
    `;
  const { rows } = await pool.query(statement, [commentId]);
  return rows[0].parentid ? true : false;
};

/**
 * 修改评论
 */
export const updateComment = async (comment: CommentModel) => {
  const { content, id } = comment;
  const statement = `
        UPDATE "comment"
        SET content = $1
        WHERE id = $2
        RETURNING *
    `;
  const { rows } = await pool.query(statement, [content, id]);
  return rows;
};

/**
 * 删除评论
 */
export const deleteComment = async (commentId: number) => {
  const statement = `
        DELETE FROM "comment"
        WHERE id = $1
        RETURNING *
    `;
  const { rows } = await pool.query(statement, [commentId]);
  return rows;
};

/**
 * 获取评论列表
 */
interface GetCommentsOptions {
  filter?: GetPostsOptionsFilter;
  pagination?: GetPostsOptionsPagination;
}

export const getComments = async (options: GetCommentsOptions) => {
  const {
    filter,
    pagination: { limit, offset },
  } = options;

  let params: Array<any> = [limit, offset];
  // 更新参数
  if (filter.param) {
    params = [filter.param, ...params];
  }
  const len = params.length;
  const statement = `
    SELECT DISTINCT ON (comment.id)
      comment.id,
      comment.content,
      ${sqlFragment.user},
      ${sqlFragment.post}
      ${filter.name == "userReplied" ? `,${sqlFragment.repliedComment}` : ""}
      ${filter.name !== "userReplied" ? `,${sqlFragment.totalReplies}` : ""}
    FROM 
     comment
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinPost}
    WHERE ${filter.sql}
    ORDER BY
      comment.id DESC 
    LIMIT $${len - 1}
    OFFSET $${len}

  `;
  const { rows } = await pool.query(statement, params);
  return rows;
};

/**
 * 统计评论数量
 */
export const getCommentsTotalCount = async (options: GetCommentsOptions) => {
  const { filter } = options;

  let params: Array<any> = [];

  if (filter.param) {
    params = [filter.param, ...params];
  }

  const statement = `
    SELECT 
      COUNT(
        DISTINCT comment.id
      ) AS total
    FROM 
      comment
      ${sqlFragment.leftJoinUser}
      ${sqlFragment.leftJoinPost}
    WHERE ${filter.sql}
  `;
  const { rows } = await pool.query(statement, params);
  return rows[0];
};

/**
 * 评论回复列表
 */
interface GetCommentRepliesOptions {
  commentId: number;
}
export const getCommentReplies = async (optins: GetCommentRepliesOptions) => {
  const { commentId } = optins;
  const statement = `
    SELECT
      comment.id,
      comment.content,
      ${sqlFragment.user}
    FROM 
      comment
      ${sqlFragment.leftJoinUser}
    WHERE
      comment.parentid = $1
  `;
  console.log(statement);
  const { rows } = await pool.query(statement, [commentId]);
  return rows;
};
