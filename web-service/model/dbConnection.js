const {Client} = require('pg');

const db = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: '313180285',
  database: 'projek-sig',
})

db.connect()
module.exports = db;