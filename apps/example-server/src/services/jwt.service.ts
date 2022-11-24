import { _envConfig } from '@/common/envConfig';
import jwt from 'jsonwebtoken';

export class JwtService {
  private secret: string;
  private refreshExp: string;

  constructor() {
    this.secret = _envConfig.getFromEnv('JWT_SECRET');
    this.refreshExp = _envConfig.getFromEnv('REFRESH_TOKEN_EXP');
  }

  signJwt(payload: object): string {
    return jwt.sign(payload, this.secret);
  }

  signRefreshToken(payload: object): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.refreshExp,
    });
  }

  decodeJwt<T>(token: string | undefined) {
    if (!token) return null;
    const cleanToken = this.getCleanToken(token);
    try {
      return jwt.verify(cleanToken, this.secret) as T;
    } catch (err) {
      return null;
    }
  }

  private getCleanToken(token: string): string {
    return token.startsWith('Bearer ') ? token.slice(7) : token;
  }
}

export const _jwtService = new JwtService();
