import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '../core/core.module';
import { LoggerModule } from '../utils/logger';
import { UsersRepository } from './repository';
import { Users } from './models';
import { Module } from '@nestjs/common';
import { UsersService } from './services/user.service';
import { UserMapperProfile } from './mappings/user-mapper';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([Users]), CoreModule],
  providers: [
    UsersRepository,
    UsersService,
    UsersRepository,
    UserMapperProfile,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
