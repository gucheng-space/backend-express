import _ from "lodash";
import { createST } from "../../utils/createST";
import { pool } from "../app/database/postgresql";
import { AvatarModel } from "./avatar.model";

/**
 * 保存头像文件信息
 */
export const createAvatar = async (avatar: AvatarModel) => {
  const { setClause, values } = createST({
    obj: avatar,
    options: "INSERT",
  });
  const statement = `
    INSERT INTO avatar(${setClause})
    VALUES(${values.map((_, i) => `$${i + 1}`).join(",")})
    RETURNING *
  `;
  const { rows } = await pool.query(statement, values);
  return rows;
};

/**
 * 按照用户 ID 查找头像
 */
export const findAvatarByUserId = async (userId: number) => {
  const statement = `
        SELECT * FROM avatar
        WHERE userid = $1
        ORDER BY avatar.userid DESC
        LIMIT 1
    `;
  const { rows } = await pool.query(statement, [userId]);
  return rows[0];
};
