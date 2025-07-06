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
  INSERT INTO post (title,content)
   VALUES ($1,$2)
   RETURNING *
  `;
  const { rows } = await pool.query(statement, [post.title, post.content]);
  return rows;
};

/**
 * 更新文章
 */
export const updatePost = async (postId: number, post: PostModel) => {
  const fields = Object.entries(post);
  const setClause = fields.map(([key], i) => `${key} = $${i + 1}`).join(", ");
  const values = fields.map(([_, value]) => value);
  const statement = `
    UPDATE post
    SET ${setClause}
    WHERE id = $${fields.length + 1}
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
