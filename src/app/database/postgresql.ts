import { Pool } from "pg";

import {
  POSTGRESQL_HOST,
  POSTGRESQL_PORT,
  POSTGRESQL_NAME,
  POSTGRESQL_PASSWORD,
  POSTGRESQL_DATABASE,
} from "../app.config";

interface DBConfig {
  user: string;
  host: string;
  database: string;
  password?: string;
  port: number;
}

const config: DBConfig = {
  user: POSTGRESQL_NAME,
  host: POSTGRESQL_HOST,
  password: POSTGRESQL_PASSWORD,
  database: POSTGRESQL_DATABASE,
  port: parseInt(POSTGRESQL_PORT, 10),
};

/**
 * 创建 PostgreSQL 连接池
 */
export const pool = new Pool(config);
