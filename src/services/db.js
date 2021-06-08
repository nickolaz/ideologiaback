const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config()
let { DB_HOST , DB_PORT , DB_NAME , DB_USER , DB_PASS } =  process.env;

const db = new pg.Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASS,
    port: Number(DB_PORT),
    ssl: {rejectUnauthorized: false}
});

async function query(sql){
    let promise = new Promise((resolve, reject) => {
        db.query(sql,[],async (error, result) => {
            if (error) {
                reject(error);
            }else {
                resolve(result.rows);
            }
        }); 
    });
    let res = await promise;
    return res;
}

module.exports.query = query;