const fs = require('fs');

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
    ca: fs.readFileSync('/certs/ca.crt').toString(),
    key: fs.readFileSync('/certs/client.auditable_accounting_node1.key').toString(),
    cert: fs.readFileSync('/certs/client.auditable_accounting_node1.crt').toString(),
  },
};
