import {ApplicationConfig, BlockChainRegisterApplication} from './application';
import {config as sqlConfig} from './datasources/postgres-db.datasource.config.ssl';

const {Client} = require('node-postgres');
const fs = require('fs');

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  try {
    fs.writeFileSync('./secrets.json', JSON.stringify({
      privateKey: process.env.WEB3_KEY
    }));
  } catch (err) {
    console.error(`Error storing the secrets.json file`);
  }

  const app = new BlockChainRegisterApplication(options);
  await app.boot();
  //await app.migrateSchema();

  const client = new Client(sqlConfig);
  await client.connect()
    .then(() => {
      client.query('CREATE SEQUENCE IF NOT EXISTS public.registry_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1');
      client.query("CREATE TABLE IF NOT EXISTS public.blockchain (id text PRIMARY KEY NOT NULL, nonce integer NOT NULL, txhash text NOT NULL, \"timestamp\" integer DEFAULT 1631727777 NOT NULL, registrationstate text DEFAULT 'unregistered'::text NOT NULL)");
      client.query("CREATE TABLE IF NOT EXISTS public.registry (id integer PRIMARY KEY NOT NULL DEFAULT nextval('public.registry_id_seq'), dateofreception integer, datahash text, merkleroot text, merkleproof text, readyforregistration boolean DEFAULT true)");
      client.query("CREATE TABLE IF NOT EXISTS public.merkletree (id text PRIMARY KEY NOT NULL, merkletree text NOT NULL, \"timestamp\" integer NOT NULL)");
      client.query(`ALTER TABLE IF EXISTS public.blockchain OWNER TO "${process.env.DB_USER}"`);
      client.query(`ALTER TABLE IF EXISTS public.registry OWNER TO "${process.env.DB_USER}"`);
      client.query(`ALTER TABLE IF EXISTS public.registry_id_seq OWNER TO "${process.env.DB_USER}"`);
      client.query(`ALTER TABLE IF EXISTS public.merkletree OWNER TO "${process.env.DB_USER}"`);
      client.query(`ALTER SEQUENCE IF EXISTS public.registry_id_seq OWNED BY public.registry.id`);
      client.end();
      console.log("DB migration completed.");
    }).catch((err: {stack: any;}) => console.error('connection error', err.stack));

  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/explorer`);

  return app;
}

if (require.main === module) {
  const config = {
    rest: {
      host: '0.0.0.0',
      port: 3000,
      gracePeriodForClose: 5000,
      openApiSpec: {
        setServersFromRequest: true,
      },
      cors: {
        origin: process.env.ALLOWED_CORS,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400,
        credentials: true
      }
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
