import pkg from "pg";
const { Pool } = pkg;
const config = global.config.sql.pgsql;
const db = new Pool(config);

export default db;