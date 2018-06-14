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
  host: getenv('PARSE_ADDR'),
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
  alias: {
    '': null,
    analytics: {
      host: getenv('ANALYTICS_SERVER_HOST'),
      prefix: 'api/v1',
      protocol: 'http',
    },
  },
  cors: {
    whitelist: {
      development: [
        undefined,
        'http://localhost',
        'http://127.0.0.1:3001',
        'http://localhost:3001',
        'http://merchant.dev.com',
      ],
      staging: [
        undefined,
        'http://localhost',
        'https://nodaji.herokuapp.com/',
      ],
      production: [
        undefined,
        'http://localhost',
        'https://nodaji.herokuapp.com/',
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
