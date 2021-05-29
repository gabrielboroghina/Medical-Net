const {Pool} = require('postgres-pool');

const options = {
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 0,
};

const pool = new Pool({
    connectionString: `postgres://${options.user}:${options.password}@${options.host}:${options.port}/${options.database}`,
});

const executeQuery = async (text, params) => {
    const start = Date.now();
    const {
        rows,
    } = await pool.query(text, params);
    const duration = Date.now() - start;

    console.log(`Query took ${duration} and returned ${rows.length} rows.`);
    return rows;
};

module.exports = {
    executeQuery,
};
