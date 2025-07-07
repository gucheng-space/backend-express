import { pool } from "../app/database/postgresql";
import { FileModel } from "./file.model";
import { createST } from "../../utils/createST";
import { requestUrl } from "src/app/app.middleware";

/**
 * 储存文件信息
 */
export const createFile = async (file: FileModel) => {
  const { setClause, values } = createST({ obj: file, options: "INSERT" });
  const statement = `
    INSERT INTO file (${setClause})
    VALUES (${values.map((_, i) => `$${i + 1}`).join(", ")})
    RETURNING *
  `;
  const { rows } = await pool.query(statement, [...values]);
  return rows;
};

/**
 * 文件服务
 */
export const getFileById = async (fileId: number) => {
  const statement = `
  SELECT * FROM file
  WHERE id = $1
  `;
  const { rows } = await pool.query(statement, [fileId]);
  return rows[0];
};
