import { CommentDisplayModel } from './dto/comment-display-model';
import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
  Get,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseController } from '../core/base.controller';
import { ReqUserModel } from '../core/domain/dto';
import { GetReqUser } from '../utils/getReqUser.decorator';
import { BlogsError } from '../utils/errors';
import { CommentService } from './services/comment.service';
import { AuthGuard } from '@nestjs/passport';
import { AddCommentDto } from './dto';
import { ListApiQueryDto } from '../core/dto';
import { ApiPagedCollectionResponse, PagedCollection } from '../utils/pagination';
import { PaginationSearchTerm, PaginationSkip, PaginationTake } from '../core/dto/api-query-constant';

@ApiTags('Comments')
@Controller('posts/:postId/comments')
@ApiBearerAuth()
export class CommentController extends BaseController {
  constructor(private _commentService: CommentService) {
    super();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CommentDisplayModel,
  })
  @ApiBody({
    type: AddCommentDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Body() model: AddCommentDto,
    @GetReqUser('reqUser') reqUser: ReqUserModel,
  ): Promise<CommentDisplayModel | BlogsError> {
    return this.getResult(
      await this._commentService.createComment(postId, model, reqUser),
    );
  }

  // @Get()
  // @ApiOperation({ summary: 'Get comments for a post' })
  // @ApiResponse({ status: HttpStatus.OK, type: [Comment] })
  // async getCommentsByPostId( @Param('postId') postId: string,) {
  //   return this.commentService.getCommentsByPostId(postId);
  // }
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get comments by post ID' })
  @ApiPagedCollectionResponse(CommentDisplayModel)
  @ApiQuery(PaginationSearchTerm(['content']))
  @ApiQuery(PaginationSkip)
  @ApiQuery(PaginationTake)
  @ApiQuery({
    required: false,
    name: 'include',
    isArray: true,
    enum: ['user', 'post'],
  })
  @Get()
  async getCommentsByPostId(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Query() query: ListApiQueryDto,
  ): Promise<PagedCollection<CommentDisplayModel> | BlogsError> {
    return this.getResult(
      await this._commentService.getCommentsByPostId(postId, query),
    );
  }
}
