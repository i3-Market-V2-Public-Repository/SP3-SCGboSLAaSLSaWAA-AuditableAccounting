export const config = {
  name: "postgresDB",
  connector: "postgresql",
  host: process.env.DB_HOST ? String(process.env.DB_HOST) : '',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : '',
  user: process.env.DB_USER ? String(process.env.DB_USER) : '',
  password: process.env.DB_PASS ? String(process.env.DB_PASS) : '',
  database: process.env.DB_NAME ? String(process.env.DB_NAME) : '',
};
