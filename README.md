
## Description
Welcome to the Git repository for the Blog Application - Blog Application API Repository developed using NestJS + TypeScript. This repository contains the source code, database schema, and configuration files for building and deploying the Backend API. Below, you will find essential information about the project's structure, setup, and available commands.
## Description

A CRUD Web API with NestJs, Postgres, TypeORM.

## Installation

## Getting Started

1. Set up a PostgreSQL database on your local server and add .env file

```bash
DB_CONNECTION=postgres
DB_HOST= localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-pg-password
DB_DATABASE=blog
DB_LOGGING=level

JWT_SECRET=abcdabjhj
JWT_ACCESS_TOKEN_TTL=3600
```

2. Clone this repository to your local machine:
- branch: master

```bash
git clone https://github.com/nikita-surani/back-end.git
cd back-end
npm install || npm i --force
```

3. To Setup the environment first time run the following commands to setup the database:

```bash
npm run migrations
npm run seed
```

4. start development:

```bash
npm run start:dev
```

## API setup

1. The swagger documentation is: `/swagger`

- example: `http://localhost:3000/swagger`

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Notes
This application includes CRUD operations for blog posts, user authentication, pagination, search term and the ability for users to comment on posts. Ensure you have Node.js and npm installed on your machine before getting started.
