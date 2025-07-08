import { pool } from "../app/database/postgresql";
import { FileModel } from "./file.model";
import { createST } from "../../utils/createST";
import path from "path";
import Jimp from "jimp";

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

/**
 * 调整图像尺寸
 */
export const imageResizer = async (image: Jimp, file: Express.Multer.File) => {
  const { imageSize } = image["_exif"];

  const filePath = path.join(file.destination, "resize", file.filename);

  if (imageSize.width > 1280) {
    image.resize(1280, Jimp.AUTO).quality(85).write(`${filePath}-large`);
  }

  if (imageSize.width > 640) {
    image.resize(640, Jimp.AUTO).quality(85).write(`${filePath}-meduim`);
  }

  if (imageSize.width > 320) {
    image.resize(320, Jimp.AUTO).quality(85).write(`${filePath}-thumbnail`);
  }
};
