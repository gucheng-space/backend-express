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
interface GetUserOptions {
  password?: boolean;
}

export const getUserByName = async (
  name: string,
  option: GetUserOptions = {}
) => {
  const { password } = option;
  const statement = `
  SELECT
   id,name 
   ${password ? ",password" : ""} 
  FROM "user"
  WHERE name = $1
  `;
  const { rows } = await pool.query(statement, [name]);
  return rows[0];
};
