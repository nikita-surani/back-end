import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from '../../env';
import { UsersRepository } from '../../users/repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.jwt.secretKey,
    });
  }
  async validate(payload: any): Promise<any> {
    const user = await this._usersRepository.getById(payload.id);
    if (!user) {
            throw new UnauthorizedException('You are not authorized to perform the operation');
        }
    return payload;
  }
}
