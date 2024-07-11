import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '../core/core.module';
import { LoggerModule } from '../utils/logger';
import { Comments } from './models';
import { Module } from '@nestjs/common';
import { CommentMapperProfile } from './mappings';
import { CommentService } from './services/comment.service';
import { CommentsRepository } from './repository';
import { Posts } from '../posts/models';
import { Users } from '../users/models';
import { UsersRepository } from '../users/repository';
import { PostsRepository } from '../posts/repository/post.repository';
import { CommentController } from './comments.controller';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([Comments, Posts, Users]),
    CoreModule,
  ],
  controllers: [CommentController],
  providers: [
    UsersRepository,
    PostsRepository,
    CommentsRepository,
    CommentService,
    CommentMapperProfile,
  ],
  //   exports: [UsersRepository],
})
export class CommentsModule {}
