import { pool } from "../app/database/postgresql";
import { TagModel } from "./tag.model";
import { createST } from "../../utils/createST";

/**
 * 创建标签
 */
export const createTag = async (tag: TagModel) => {
  const { setClause, values } = createST({ obj: tag, options: "INSERT" });
  const statement = `
    INSERT INTO tag(${setClause})
    VALUES(${values.map((_, i) => `$${i + 1}`).join(",")})
    RETURNING *
    `;
  const { rows } = await pool.query(statement, [tag.name]);
  return rows[0] as any;
};
/**
 *按照名字查标签
 */
export const getTagByName = async (tagName: string) => {
  const statement = `
    SELECT id,name FROM tag
    WHERE name = $1
    `;
  const { rows } = await pool.query(statement, [tagName]);
  return rows[0];
};
