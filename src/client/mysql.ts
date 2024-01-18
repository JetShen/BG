import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    port: 3306,
};

export async function GetClient() {
    const connection = await mysql.createConnection(config);
    return connection;
}
