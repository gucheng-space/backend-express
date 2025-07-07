import { createST } from "../../utils/createST";
import { pool } from "../app/database/postgresql";
import { PostModel } from "./post.model";

/**
 * 获取所有文章
 */
export const getPosts = async () => {
  const statement = `
    SELECT
      post.id,
      post.title,
      post.content,
      JSON_BUILD_OBJECT(
        'id', "user".id,
        'username', "user".name
      ) AS user
    FROM post
    LEFT JOIN "user"
    ON "user".id = post.userid
  `;
  const { rows } = await pool.query(statement);
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
