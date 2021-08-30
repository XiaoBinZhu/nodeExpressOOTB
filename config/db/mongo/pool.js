import mongoose from "mongoose";
import * as models from "./models.js"
const { host, port, database, user, password } = global.config.sql.mongo;
const dbPath = `mongodb://${user}:${password}@${host}:${port}/${database}`
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}

mongoose.connect(dbPath, dbOptions).then(() => {
  console.log("mongodb successfully connected");
}).catch(err => {
  console.log("Can not connect to mongodb database", err);
});

// let userModel = models.createUserModel(mongoose);
export default class Mongo {

}