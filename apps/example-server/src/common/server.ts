import express, { Application } from 'express';
import path from 'path';
import http from 'http';
import os from 'os';
import l from './logger';
import errorHandler from '../middlewares/error.handler';
import { setupAuth } from './auth';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from '@/app.router';
import { createContext } from '@/context';

const app = express();

export default class ExpressServer {
  constructor() {
    this.setupTrpc();
    this.setupFrontendServer();
    setupAuth();
  }

  private setupTrpc() {
    app.use(
      '/trpc',
      trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
      })
    );
  }

  private setupFrontendServer() {
    const root = path.normalize(__dirname + '/../..');
    app.use(express.static(`${root}/public`));
  }

  router(routes: (app: Application) => void): ExpressServer {
    routes(app);
    app.use(errorHandler);
    return this;
  }

  listen(port: number): Application {
    const welcome = (p: number) => (): void =>
      l.info(
        `up and running in ${
          process.env.NODE_ENV || 'development'
        } @: ${os.hostname()} on port: ${p}}`
      );

    http.createServer(app).listen(port, welcome(port));

    return app;
  }
}
