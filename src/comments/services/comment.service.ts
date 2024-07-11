import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import {
  IPostsRepository,
  PostsRepository,
} from '../../posts/repository/post.repository';
import { IUsersRepository, UsersRepository } from '../../users/repository';
import { WinstonLogger } from '../../utils/logger';
import { CommentsRepository, ICommentsRepository } from '../repository';
import { ErrorItemNotFound, ErrorListingItem } from '../../core/error-codes';
import { ReqUserModel } from '../../core/domain/dto';
import { AddCommentDto, CommentDisplayModel } from '../dto';
import { BlogsError } from '../../utils/errors';
import { PostErrorCodes, PostResourceNames } from '../../posts/error-codes';
import { Comments } from '../models';
import { v4 as uuid } from 'uuid';
import { CommentErrorCodes, CommentResourceNames } from '../error-codes';
import { UserErrorCodes, UserResourceNames } from '../../users/error-codes';
import { PagedCollection } from '../../utils/pagination';
import { ListApiQueryDto } from '../../core/dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectMapper()
    private readonly _mapper: Mapper,
    private readonly _logger: WinstonLogger,

    @Inject(CommentsRepository)
    private readonly _commentsRepository: ICommentsRepository,
    @Inject(PostsRepository)
    private readonly _postsRepository: IPostsRepository,

    @Inject(UsersRepository)
    private readonly _usersRepository: IUsersRepository,
  ) {
    this._logger.setScope(__filename);
  }

  async createComment(
    postId: string,
    model: AddCommentDto,
    reqUser: ReqUserModel,
  ): Promise<CommentDisplayModel | BlogsError> {
    try {
      this._logger.info(
        `Executing create comment with Payload: ${JSON.stringify(model)}.`,
      );

      const user = await this._usersRepository.getById(reqUser.id);
      if (!user) {
        return new ErrorItemNotFound(
          UserResourceNames.UserNameSingular,
          UserErrorCodes.ErrUserNotFound,
          `UserId :${reqUser.id}`,
        );
      }

      const post = await this._postsRepository.getById(postId);
      if (!post) {
        return new ErrorItemNotFound(
          PostResourceNames.PostNameSingular,
          PostErrorCodes.ErrPostNotFound,
          `PostId :${postId}`,
        );
      }

      // Create a new comment
      const newComment = new Comments(
        uuid(), // Generate a new UUID for the comment
        model.content,
        user,
        post,
        reqUser.id,
      );

      const outCome = await this._commentsRepository.save(newComment);
      const displayModel = this._mapper.map(
        outCome,
        Comments,
        CommentDisplayModel,
      );

      this._logger.info(
        `Successfully created comment with Id: ${newComment.id}.`,
      );

      return displayModel;
    } catch (ex) {
      const error = new BlogsError(
        CommentResourceNames.CommentNameSingular,
        CommentErrorCodes.ErrCommentAdd,
        `PostId :${postId}`,
        ex,
      );
      this._logger.error(error.message, ex);
      return error;
    }
  }

  async getCommentsByPostId(
    postId: string,
    query: ListApiQueryDto,
  ): Promise<PagedCollection<CommentDisplayModel> | BlogsError> {
    try {
      this._logger.info(`Executing fetch comments by post Id: ${postId}.`);

      const [commentsList, count] =
        await this._commentsRepository.getPostCommentList(postId, query);

      const displayModel = this._mapper.mapArray(
        commentsList,
        Comments,
        CommentDisplayModel,
      );

      this._logger.info(
        `Successfully fetched comments for post Id: ${postId}.`,
      );

      return new PagedCollection<CommentDisplayModel>(
        query.skip,
        query.take,
        count,
        displayModel,
      );
    } catch (ex) {
      const error = new ErrorListingItem(
        CommentResourceNames.CommentNamePlural,
        CommentErrorCodes.ErrCommentList,
        `postId: ${postId}`,
        ex,
      );
      this._logger.error(error.message, ex);
      return error;
    }
  }
}
