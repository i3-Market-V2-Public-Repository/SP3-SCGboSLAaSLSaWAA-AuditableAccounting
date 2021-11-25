# Auditable Accounting

This repository contains all the necesary components to deploy an auditable accounting.
Components:

* API: Loopback 4
* Database: PostgreSQL
* Blockchain: Truffle with ganache
* Block explorer: ethereum-lite-explorer

## Contents
<!-- TOC -->
- [Auditable Accounting](#auditable-accounting)
  - [Contents](#contents)
  - [Project structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Configuration](#configuration)
<!-- /TOC -->

## Project structure

```
📁auditable-accounting
├─📄setup.js (*1)       - script to set the folder containing the docker-compose.yml and the .env files up
├─📄package.json        
├─📄package-lock.json
├─📁truffle (*2)        - truffle source code
└─📁loopback            - loopback4 source code
  ├─🐳Dockerfile        - instructions to assemble the image
  ├─📄lbentry.sh        - entry point for the Dockerfile
  └─📄lbsetup.js        - script to create the necessary configuration files for loopback

(*1)
📁devnet                  (the name for this folder can be altered)
├─🐳docker-compose.yml  - file defining the services that make everything up
└─📄.env                - file containing environment variables

(*2)
📁truffle
├─🐳Dockerfile          - instructions to assemble the image
└─📄setup.js            - entry point for the Dockerfile
```

## Getting Started

### Prerequisites

Please make sure you have the following installed and running properly

* [Node.js](https://nodejs.org/en/download/), [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/install/)
* It you will also need NPM to install the necessary packages (NPM is distributed with Node.js. For more information see: <https://www.npmjs.com/get-npm>)

### Configuration

Edit any value in `config.example.json` if desired.

```json
{
  "RESTART_POLICY": "unless-stopped",
  "DIR_VOLUMES": "./docker-volumes",
  "MNEMONIC": "test test test test test test test test test test test junk",
  "LB_PORT": 8080,
  "PROVIDER": "http://truffle:9545",
  "PROVIDER_NAME": "local ganache",
  "GAS": 400000,
  "POSTGRES_IMAGE": "postgres:11.11",
  "POSTGRES_HOST": "postgres",
  "POSTGRES_PORT": 5432,
  "POSTGRES_USER": "user",
  "POSTGRES_PASSWORD": "p4ssw0rd",
  "POSTGRES_DB": "db",
  "BLOCK_TIME": 2,
  "EXPLORER_PORT": 8081,
  "APP_NODE_URL": "http://localhost:9545",
  "options": {
    "internalPostgres": true,
    "devEnvironment": false,
    "ganache": true,
    "randomMnemonic": false,
    "directoryName": "compose"
  }
}
```

Observe that options field is the object containing the parameters to be executed by `setup.js`.

Install necessary packages and run `setup.js` script in the parent folder.

```bash
npm install 
node setup.js
```

`setup.js` creates the folder (whose name is given by `directoryName`, `docker-compose` by default) containing the necessary `.env` and `docker-compose.yml` files.

**IMPORTANT:** If `devEnvironment` is set to true, it also creates necessary files inside loopback's folder to fully setup this folder as it will be our running volume.

Then, launch the docker compose to build images and start the container.

```bash
cd /auditable-accounting/docker-compose
docker-compose up -d
```

**IMPORTANT:** Before changing to the development environment, the loopback image has to be rebuilded.

```bash
docker-compose build loopback
docker-compose up -d
```

**NOTE:** If `randomMnemonic` is set to true, it creates a random mnemonic instead of the default one.

By default, these are the URLs of each component.

* API: <http://localhost:8080>
* Explorer: <http://localhost:8081>
