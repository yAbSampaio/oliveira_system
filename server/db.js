const Pool = require('pg').Pool;

const pool = new Pool({
  user: "postgres",
  password: "absadboy",
  host: "localhost",
  port: 5432,
  database:"oliveira_clients"
});

module.exports = pool;