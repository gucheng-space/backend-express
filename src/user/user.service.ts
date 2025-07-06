import { UserModel } from "./user.model";
import { pool } from "../app/database/postgresql";

/**
 * 创建用户
 */
export const createUser = async (user: UserModel) => {
  const statement = `
    INSERT INTO "user" (name,password)
    VALUES  ($1,$2)
    RETURNING "user".name
  `;
  const { rows } = await pool.query(statement, [user.name, user.password]);
  return rows;
};
/**
 * 按用户名查找用户
 */
export const getUserByName = async (name: string) => {
  const statement = `
  SELECT id,name 
  FROM "user"
  WHERE name = $1
  `;
  const { rows } = await pool.query(statement, [name]);
  return rows[0];
};
