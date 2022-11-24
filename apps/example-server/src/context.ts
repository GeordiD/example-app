import { inferAsyncReturnType } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { JwtPayload } from 'jsonwebtoken';
import { _jwtService } from './services/jwt.service';

export async function createContext({
  req,
}: trpcExpress.CreateExpressContextOptions) {
  const user = _jwtService.decodeJwt<JwtPayload>(req.headers.authorization);

  return {
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
