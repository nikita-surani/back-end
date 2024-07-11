import * as dotenv from 'dotenv';
import * as path from 'path';
import {
  getOsEnv,
  getOsEnvOptional,
  toNumber,
} from './utils/env/env-extensions';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({
  path: path.join(
    process.cwd(),
    `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`,
  ),
});

/**
 * Environment variables
 */
export const env = {
  db: {
    type: getOsEnv('DB_CONNECTION'),
    host: getOsEnvOptional('DB_HOST'),
    port: toNumber(getOsEnvOptional('DB_PORT')),
    username: getOsEnvOptional('DB_USERNAME'),
    password: getOsEnvOptional('DB_PASSWORD'),
    database: getOsEnv('DB_DATABASE'),
  },
  jwt: {
    secretKey: getOsEnv('JWT_SECRET'),
    expiresIn: parseInt(getOsEnv('JWT_ACCESS_TOKEN_TTL')),
  },
};
