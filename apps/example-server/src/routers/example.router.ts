import { _examplesService } from '@/services/example.service';
import { authenticatedProcedure, procedure, router } from '@/trpc';
import { z } from 'zod';

export const exampleRouter = router({
  getAll: procedure.query(async () => {
    return await _examplesService.all();
  }),
  create: authenticatedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      })
    )
    .mutation(async (req) => {
      return await _examplesService.create(req.input.name);
    }),
});
