import { _authenticationService } from '@/services/authentication.service';
import { _jwtService } from '@/services/jwt.service';
import { _userService } from '@/services/user.service';
import { procedure, router } from '@/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export interface JwtPayload {
  id: string;
  email: string;
}

export const userRouter = router({
  create: procedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async (req) => {
      _userService.createUser({
        name: req.input.name,
        email: req.input.email,
        rawPassword: req.input.password,
      });
    }),
  login: procedure
    .input(
      z.object({
        email: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .query(async (req) => {
      const user = await _userService.getUserByEmail(req.input.email);

      if (user) {
        const storedPasswordHash = await _userService.getPasswordHash(user.id);

        if (
          await _authenticationService.checkPassword(
            req.input.password,
            storedPasswordHash
          )
        ) {
          const payload: JwtPayload = {
            id: user.id,
            email: user.email,
          };

          const token = _jwtService.signJwt(payload);
          const refreshToken = _jwtService.signRefreshToken(payload);

          return {
            token,
            refreshToken,
            user: payload,
          };
        }
      }

      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }),
  refresh: procedure.input(z.string()).query(async (req) => {
    const refreshToken = req.input;

    const decodedUser = _jwtService.decodeJwt<JwtPayload>(refreshToken);
    if (decodedUser) {
      const freshUser = await _userService.getUserByEmail(decodedUser.email);
      if (freshUser) {
        const payload: JwtPayload = {
          id: freshUser.id,
          email: freshUser.email,
        };
        const token = _jwtService.signJwt(payload);

        return {
          token,
          user: payload,
        };
      }
    }

    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }),
});
