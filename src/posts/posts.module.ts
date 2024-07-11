import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../utils/logger';
import { Posts } from './models';
import { PostsService } from './services/post.service';
import { PostsController } from './posts.controller';
import { Users } from '../users/models';
import { UsersRepository } from '../users/repository';
import { PostsRepository } from './repository/post.repository';
import { PostMapperProfile } from './mappings/post-mapper';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([Posts, Users])],
  providers: [
    PostsService,
    PostsRepository,
    UsersRepository,
    PostMapperProfile,
  ],
  controllers: [PostsController],
  exports: [PostsRepository],
})
export class PostsModule {}
