import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from "../app/app.config";
import { pool } from "../app/database/postgresql";

/**
 * 签发令牌
 */
interface SignTokenOptions {
  paylode?: any;
}

export const signToken = (options: SignTokenOptions) => {
  const { paylode } = options;

  const Token = jwt.sign(paylode, PRIVATE_KEY, { algorithm: "RS256" });
  return Token;
};

/**
 * 检查用户是否有指定资源
 */
interface PossessOptions {
  resourceId: number;
  resourceType: string;
  userId: number;
}

export const possess = async (options: PossessOptions) => {
  const { resourceId, resourceType, userId } = options;
  const statement = `
  SELECT COUNT(${resourceType}.id) as count
  FROM ${resourceType}
  WHERE id = $1 AND userid = $2
  `;
  const { rows } = await pool.query(statement, [resourceId, userId]);
  return rows[0].count == 1;
};
