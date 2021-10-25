import mongoose from "mongoose";
import chalk from 'chalk';
const { host, port, database, user, password } = global.config.sql.mongo;
const dbPath = `mongodb://${user}:${password}@${host}:${port}/${database}`
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
mongoose.connect(dbPath, dbOptions);
mongoose.Promise = global.Promise;
const mongoDB = mongoose.connection;
mongoDB.once('open' ,() => {
	console.log('mongodb successfully connected');
})

mongoDB.on('error', function(error) {
    console.error(
      chalk.red('Can not connect to mongodb database: ' + error)
    );
    mongoose.disconnect();
});

mongoDB.on('close', function() {
    console.log(
      chalk.red('The database is disconnected and connected to the database again')
    );
    mongoose.connect(dbPath, Object.assign(person,dbOptions,{server:{auto_reconnect:true}}));
});

export default mongoDB