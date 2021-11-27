import {ApplicationConfig, BlockChainRegisterApplication} from './application';
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
  await app.migrateSchema();
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
