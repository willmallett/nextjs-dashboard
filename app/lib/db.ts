import postgres from "postgres";

const sql = postgres({
    host: process.env.POSTGRES_HOST,
    port: 5432,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USER,
});

export default sql;
