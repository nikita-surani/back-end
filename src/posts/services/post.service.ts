import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ReqUserModel } from '../../core/domain/dto';
import { BlogsError } from '../../utils/errors';
import {
  IPostsRepository,
  PostsRepository,
} from '../repository/post.repository';
import { AddPostModel, PostDisplayModel } from '../dto';
import { Posts } from '../models';
import { v4 as uuid } from 'uuid';
import { WinstonLogger } from '../../utils/logger';
import {
  IUsersRepository,
  UsersRepository,
} from '../../users/repository/user.repository';
import { ListApiQueryDto } from '../../core/dto';
import { PagedCollection } from '../../utils/pagination';
import {
  ErrorItemNotFound,
  ErrorListingItem,
  ErrorUpdatingItem,
} from '../../core/error-codes';
import { PostErrorCodes, PostResourceNames } from '../error-codes';
import * as jsonPatch from 'fast-json-patch';

@Injectable()
export class PostsService {
  constructor(
    @InjectMapper()
    private readonly _mapper: Mapper,
    private readonly _logger: WinstonLogger,

    @Inject(PostsRepository)
    private readonly _postsRepository: IPostsRepository,

    @Inject(UsersRepository)
    private readonly _usersRepository: IUsersRepository,
  ) {
    this._logger.setScope(__filename);
  }

  async createBlogPost(
    model: AddPostModel,
    reqUser: ReqUserModel,
  ): Promise<PostDisplayModel | BlogsError > {
    try {
      this._logger.info(
        `Executing create blog post with Payload: ${JSON.stringify(model)}.`,
      );

      const objUser = await this._usersRepository.getById(reqUser.id);

      // Create a new post
      const newPost = new Posts(
        uuid(), // Generate a new UUID for the post
        model.title,
        model.content,
        objUser,
        reqUser.id,
      );

      await this._postsRepository.save(newPost);
      const displayModel = this._mapper.map(newPost, Posts, PostDisplayModel);

      this._logger.info(
        `Successfully created blog post with Id: ${newPost.id}.`,
      );

      return displayModel;
    } catch (ex) {
      const error = new BlogsError(
        PostResourceNames.PostNameSingular,
        PostErrorCodes.ErrPostNotFound,
        null,
        ex,
      );
      this._logger.error(error.message, ex);
      return error;
    }
  }

  async getPostList(
    query: ListApiQueryDto,
  ): Promise<PagedCollection<PostDisplayModel> | BlogsError> {
    try {
      this._logger.info('Executing fetch blog posts list.');

      const [postsList, count] = await this._postsRepository.getPostList(query);

      const displayModel = this._mapper.mapArray(
        postsList,
        Posts,
        PostDisplayModel,
      );

      this._logger.info('Successfully fetched blog posts list.');

      return new PagedCollection<PostDisplayModel>(
        query.skip,
        query.take,
        count,
        displayModel,
      );
    } catch (ex) {
      const error = new ErrorListingItem(
        PostResourceNames.PostNamePlural,
        PostErrorCodes.ErrPostList,
        null,
        ex,
      );
      this._logger.error(error.message, ex);
      return error;
    }
  }

  async getPostById(
    postId: string,
    query: ListApiQueryDto,
  ): Promise<PostDisplayModel | BlogsError> {
    try {
      this._logger.info(`Executing fetch blog post by Id: ${postId}.`);

      const objPost = await this._postsRepository.getById(
        postId,
        query.include,
      );

      if (!objPost) {
        return new ErrorItemNotFound(
          PostResourceNames.PostNameSingular,
          PostErrorCodes.ErrPostNotFound,
          `PostId :${postId}`,
        );
      }

      const displayModel = this._mapper.map(objPost, Posts, PostDisplayModel);

      this._logger.info(`Successfully fetched blog post with Id: ${postId}.`);

      return displayModel;
    } catch (ex) {
      const error = new BlogsError(
        PostResourceNames.PostNameSingular,
        PostErrorCodes.ErrPostGet,
        `postId :${postId}`,
        ex,
      );
      this._logger.error(error.message, ex);
      return error;
    }
  }

  async updatePost(
    postId: string,
    patchModel: any,
    reqUser: ReqUserModel,
  ): Promise<PostDisplayModel | BlogsError> {
    try {
      this._logger.info(`Executing update blog post with Id: ${postId}.`);

      const objPost = await this._postsRepository.getByIdWithUser(
        reqUser.id,
        postId,
      );

      if (!objPost) {
        return new ErrorItemNotFound(
          PostResourceNames.PostNameSingular,
          PostErrorCodes.ErrPostNotFound,
          `PostId :${postId}`,
        );
      }

      if (objPost.user.id !== reqUser.id) {
        throw new UnauthorizedException(
          'You are not authorized to update this post',
        );
      }
      // Build existing dto
      const existingModel = new AddPostModel(objPost.title, objPost.content);

      // Apply updates to existing dto from patch dto
      jsonPatch.applyPatch(existingModel, patchModel);

      // Now update object using Domain method
      objPost.update(existingModel.title, existingModel.content, reqUser.id);

      const outcome = await this._postsRepository.save(objPost);
      const displayModel = this._mapper.map(outcome, Posts, PostDisplayModel);

      this._logger.info(`Successfully updated blog post with Id: ${postId}.`);

      return displayModel;
    } catch (ex) {
      const error = new ErrorUpdatingItem(
        PostResourceNames.PostNameSingular,
        PostErrorCodes.ErrPostUpdate,
       `PostId :${postId}`,
        ex,
      );
      this._logger.error(error.message, ex);
      return error;
    }
  }

  async deletePost(
    postId: string,
    reqUser: ReqUserModel,
  ): Promise<boolean | BlogsError> {
    try {
      this._logger.info(`Executing delete blog post with Id: ${postId}.`);

      const objPost = await this._postsRepository.getByIdWithUser(
        reqUser.id,
        postId,
      );

      if (!objPost) {
        return new ErrorItemNotFound(
          PostResourceNames.PostNameSingular,
          PostErrorCodes.ErrPostNotFound,
          `PostId :${postId}`,
        );
      }

      if (objPost.user.id !== reqUser.id) {
        throw new UnauthorizedException(
          'You are not authorized to delete this post',
        );
      }

      await this._postsRepository.remove(objPost);

      this._logger.info(`Successfully deleted blog post with Id: ${postId}.`);
      return true;
    } catch (ex) {
      const error = new BlogsError(
        PostResourceNames.PostNameSingular,
        PostErrorCodes.ErrPostDelete,
       `PostId :${postId}`,
        ex,
      );
      this._logger.error(error.message, ex);
      throw error;
    }
  }
}
