export const config = {
  name: "postgresDB",
  connector: "postgresql",
  host: process.env.DB_HOST ? String(process.env.DB_HOST) : '',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : '',
  user: process.env.DB_USER ? String(process.env.DB_USER) : '',
  database: process.env.DB_NAME ? String(process.env.DB_NAME) : '',
  debug: true,
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.DB_CA ? process.env.DB_CA : '',
    key: process.env.DB_KEY ? process.env.DB_KEY : '',
    cert: process.env.DB_CRT ? process.env.DB_CRT : '',
  },
};
