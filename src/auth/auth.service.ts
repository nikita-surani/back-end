import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/user.service';
import { loginModel } from '../users/dto';
import { IUsersRepository, UsersRepository } from '../users/repository';
import * as bcrypt from 'bcrypt';
import { env } from '../env';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,

    @Inject(UsersRepository)
    private readonly _usersRepository: IUsersRepository,
  ) {}

  async login(data: loginModel): Promise<{ accessToken: string }> {
    try {
      const user = await this._usersRepository.getUserByEmail(
        data.emailAddress,
      );

      if (user === null) {
        throw new UnauthorizedException('Email or password are incorrect');
      }

      if (!user || !user.password) {
        throw new UnauthorizedException('Email or password are incorrect');
      }

      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Email or password are incorrect');
      }

      const payload = {
        id: user.id,
        email: user.emailAddress,
        name: user.userName,
      };

      // Generate tokens
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: env.jwt.secretKey,
        expiresIn: env.jwt.expiresIn,
      });

      return { accessToken };
    } catch (error) {
      throw error;
    }
  }
}
