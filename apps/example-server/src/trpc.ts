import { initTRPC } from '@trpc/server';
import { TRPCError } from '@trpc/server';
import { Context } from './context';

const trpc = initTRPC.context<Context>().create();

export const middleware = trpc.middleware;
export const router = trpc.router;
export const procedure = trpc.procedure;

const isAuthenticated = trpc.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  return next({ ctx });
});

export const authenticatedProcedure = trpc.procedure.use(isAuthenticated);
