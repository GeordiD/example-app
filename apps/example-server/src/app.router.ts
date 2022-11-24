import { exampleRouter } from './routers/example.router';
import { userRouter } from './routers/user.router';
import { router } from './trpc';

export const appRouter = router({
  examples: exampleRouter,
  users: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
