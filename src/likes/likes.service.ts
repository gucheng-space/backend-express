import { pool } from "../app/database/postgresql";

/**
 * 保存用户点赞
 */
export const createUserLikePost = async (userId: number, postId: number) => {
  const statement = `
    INSERT INTO user_like_post(userid,postid)
    VALUES($1,$2)
    RETURNING *
  `;
  const { rows } = await pool.query(statement, [userId, postId]);
  return rows;
};

/**
 * 取消用户点赞内容
 */
export const deleteUserPost = async (userId: number, postId: number) => {
  const statement = `
    DELETE FROM user_like_post
    WHERE userid = $1 AND postid = $2
    RETURNING *
  `;
  const { rows } = await pool.query(statement, [userId, postId]);
  return rows;
};
