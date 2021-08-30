import "./config/config.js"
import "./config/casbin/index.js";
import express from "express";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.js"
import { jwtVerify, whiteList } from "./utlis/utlis.js";
import cors from "cors";

const app = express();

const corsOption = {
  credentials: true,
  origin: ['http://127.0.0.1:8000', 'http://localhost:8080'],
  optionsSuccessStatus: 200,
}
app.use(cors(corsOption));

app.use((req, res, next) => {
  req.userInfo = {};
  next()
  // if (!whiteList.includes(req.url)) {
  //   let token = req.headers['access-token']
  //   jwtVerify(token).then(async (result) => {
  //     req.userInfo = result
  //     if (await (global.config.casbin.enforce(result.role_name, req.url, req.method)) === true) {
  //     next()
  //     } else {
  //       res.status(401).send('invalid request')
  //     }
  //   }).catch(() => {
  //     res.status(401).send('invalid token')
  //   })
  // } else {
  //   next()
  // }
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', indexRouter);

export default app

