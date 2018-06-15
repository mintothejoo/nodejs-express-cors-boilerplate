import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import apicache from 'apicache';
import config from './config/config';
import cors from './config/cors';

import { requestLogger, errorLogger } from './config/logger';

import errorHandler from './error-handler';

import UnauthorizedException from './exception/unauthorized-exception';

const app = express();
const server = require('http').createServer(app);

apicache.options({
  enabled: false,
  statusCodes: {
    include: [200], // list status codes to require (e.g. [200] caches ONLY responses with a success/200 code)
  },
});
const cache = apicache.middleware;

app.set('trust proxy', 1);
if (process.env.NODE_ENV !== 'production') {
  app.use(requestLogger);
}
app.use(cache('15 minutes'));
app.use(compression());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use('/' + config.prefix + '/init', require('./routes/init-route'));

app.use((req, res, next) => {
  if (!req.user) {
    throw new UnauthorizedException();
  }
  next();
});

// app.use('/' + config.prefix + '/merchant', require('./routes/merchant-route'));

// app.use('/' + config.prefix, require('./routes/default-route'));

app.use(errorLogger);
app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
  }

  errorHandler(error, req, res);
});

server.listen(process.env.PORT);

console.log(`Server running on PORT ${process.env.PORT} for ENV ${process.env.NODE_ENV}`);

export default server;
