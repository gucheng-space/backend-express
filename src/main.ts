import express from "express";
import { Request, Response } from "express";
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`🚀 服务已启动在 ${port} 端口`);
});

app.get("/", (request: Request, response: Response) => {
  response.send("hello world");
});
