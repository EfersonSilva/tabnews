import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  await client.connect();
  try {
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

async function version() {
  const result = await query({ text: "SHOW server_version;" });
  const resultValue = result.rows[0].server_version;
  return resultValue ?? null;
}

// async function maxConnections() {
//   const result = await query({ text: "SHOW max_connections;" });
//   const resultValue = result.rows[0].max_connections;
//   return Math.floor(resultValue) ?? null;
// }

async function openedConnections() {
  const result = await query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [process.env.POSTGRES_DB],
  });
  const resultValue = result.rows[0].count;
  return resultValue ?? null;
}

export default {
  query: query,
  version: version,
  //maxConnections: maxConnections,
  openedConnections: openedConnections,
};
