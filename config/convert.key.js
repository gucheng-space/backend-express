const fs = require("fs");
const path = require("path");

/**
 * 读取密钥文件
 */
const privateKey = fs.readFileSync(path.join("config", "private.key"));
const publicKey = fs.readFileSync(path.join("config", "public.key"));

/**
 * 转换格式存储到环境变量
 */
const privateKeyBase64 = Buffer.from(privateKey).toString("base64");
const publicKeyBase64 = Buffer.from(publicKey).toString("base64");

