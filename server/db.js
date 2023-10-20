// const Pool = require('pg').Pool
require('dotenv').config()

// const pool = new Pool({
//     user: 'harrysteele',
//     password: '',
//     host: 'localhost',
//     port : ''
// })

const { Client } = require("pg");

let db = new Client({ connectionString: "postgresql:///todoapp" });

db.connect();

module.exports = db;
