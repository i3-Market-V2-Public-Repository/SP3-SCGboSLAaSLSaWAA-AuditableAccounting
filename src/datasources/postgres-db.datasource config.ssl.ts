export const config = {
  name: "postgresDB",
  connector: "postgresql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.DB_CA,
    key: process.env.DB_CRT,
    cert: process.env.DB_KEY,
  },
};
