import dotenv from "dotenv";

dotenv.config();

/**
 * 应用配置
 */

export const { APP_PORT } = process.env;

/**
 *数据库配置
 */
export const {
  POSTGRESQL_HOST,
  POSTGRESQL_PORT,
  POSTGRESQL_NAME,
  POSTGRESQL_PASSWORD,
  POSTGRESQL_DATABASE,
} = process.env;
