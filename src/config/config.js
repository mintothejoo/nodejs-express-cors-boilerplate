import dotenv from 'dotenv';
import getenv from 'getenv';
import path from 'path';
import * as definition from './../../package.json';

dotenv.config();
//dotenv.config({path: './../.env_prod'});

const config = {
  version: definition.version,
  prefix: getenv('PREFIX', 'api'),
  env: getenv('NODE_ENV', 'development'),
  date: {
    format: 'YYYY-MM-DD',
    dateTimeDisplayFormat: 'LLLL',
  },
  logger: {
    level: getenv('LOG_LEVEL', 'error'),
    meta: true,
    expressFormat: true,
    colorize: false,
    files: [{ dirname: './logs', filename: 'error.log' }],
  },
  cors: {
    whitelist: {
      development: [
        undefined,
        'http://localhost',
        'http://127.0.0.1:3000',
        'http://localhost:3000',
      ],
      staging: [
        undefined,
        'http://localhost',
      ],
      production: [
        undefined,
        'http://localhost',
      ],
    },
  },
  path: {
    src: path.resolve(__dirname),
    views: path.resolve(__dirname, '..', 'controller'),
    public: path.resolve(__dirname, '..', 'routes'),
    build: path.resolve(__dirname, '..', 'config', 'build'),
  },
};

export default config;
