import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from "../app/app.config";

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
