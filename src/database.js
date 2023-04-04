const mysql = require('mysql2');
const { database } = require('./keys');
const { promisify } = require('util');

const pool = mysql.createPool(database);
pool.getConnection((err, connection) => {
    if(err){
        if(err === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE COONECTION WAS CLOSED')
        }
        if(err === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TOO MANY CONNECTIONS')        
        }
    }
    if(connection) connection.release();
    console.log('DB IS CONNECTED');
    return;
});

pool.query = promisify(pool.query)

module.exports = pool;
