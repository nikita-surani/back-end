import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { env } from '../env';
import { Users } from '../users/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategy/jwt-strategy';
import { LoggerModule } from '../utils/logger';
import { UsersRepository } from '../users/repository';
import { UsersService } from '../users/services/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: env.jwt.secretKey,
      signOptions: {
        expiresIn: env.jwt.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([Users]),
    LoggerModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtService,
    AuthService,
    UsersRepository,
    UsersService,
  ],
  exports: [JwtService, JwtModule, JwtStrategy],
})
export class AuthenticationModule {}
