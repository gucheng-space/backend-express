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
 * 获取用户
 */
interface GetUserOptions {
  password?: boolean;
}

export const getUser = (condition: string) => {
  return async (param: string | number, option: GetUserOptions = {}) => {
    const { password } = option;
    const statement = `
      SELECT
        "user".id,
        "user".name,
        (
          CASE WHEN EXISTS (SELECT 1 FROM avatar a WHERE a.userid = "user".id) THEN 1 ELSE NULL END
        ) AS avatar
      ${password ? ",password" : ""} 
      FROM 
        "user"
      WHERE 
        ${condition} = $1
    `;
    const { rows } = await pool.query(statement, [param]);
    return rows[0] ? rows[0] : null;
  };
};

/**
 * 按用户名查找用户
 */
export const getUserByName = getUser(`"user".name`);

/**
 * 按ID查找用户
 */
export const getUserById = getUser(`"user".id`);

/**
 * 更新用户
 */
export const updateUser = async (userId: number, userDate: UserModel) => {
  const statement = `
    UPDATE 
      "user"
    SET
      name = $1,
      password = $2
    WHERE "user".id = $3
    RETURNING "user".name
  `;
  const { rows } = await pool.query(statement, [
    userDate.name,
    userDate.password,
    userId,
  ]);
  return rows;
};
