# Auditable Accounting

This repository contains an API that connects to the distributed Storage and Blockchain network from the i3-Market architecture.

* API: Loopback 4
* Database: CockroachDB
* Blockchain: BESU

## Getting started

### Prerequisites

Please make sure you have the following installed and running properly

* [Node.js](https://nodejs.org/en/download/), [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/install/)
* It you will also need NPM to install the necessary packages (NPM is distributed with Node.js. For more information see: <https://www.npmjs.com/get-npm>)

### Configuration

Edit variables from env.example.

```bash
cp env.example .env
nano .env
```

Then, launch the docker compose to build images and start the container.

```bash
docker-compose up --force-recreate
```

By default, these are the URLs of each component.

* API: <http://localhost:8080>

## How to build, install, or deploy it

Production procedures are automated with Gitlab CI/CD and AWX. To update deployment, just make a MR to pro branch.

## Credits

Jose Luis Muñoz <jose.luis.munoz@upc.edu>

## Contributing

Pull requests are always appreciated.

## License

EUPL 
