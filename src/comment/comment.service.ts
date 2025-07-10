import { pool } from "../app/database/postgresql";
import { CommentModel } from "./comment.model";
import { createST } from "../../utils/createST";

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
