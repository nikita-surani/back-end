import { BaseController } from '../core/base.controller';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetReqUser } from '../utils/getReqUser.decorator';
import { BlogsError } from '../utils/errors';
import { ReqUserModel } from '../core/domain/dto';
import { AddPostModel, PostDisplayModel } from './dto';
import { PostsService } from './services/post.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiPagedCollectionResponse,
  PagedCollection,
} from '../utils/pagination';
import {
  PaginationSearchTerm,
  PaginationSkip,
  PaginationTake,
} from '../core/dto/api-query-constant';
import { BoolResult, JsonPatchDocumentDto, ListApiQueryDto } from '../core/dto';
import { PatchValidationPipe } from '../core/pipes/patch-validation-pipe';
import { PostEnum } from './enums';
import { JsonPatchDescription } from './enums/Json-patch-description';

@ApiTags('Posts')
@Controller('posts')
export class PostsController extends BaseController {
  constructor(private _postsService: PostsService) {
    super();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Create a new post.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiBody({
    type: AddPostModel,
  })
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async createPost(
    @Body() data: AddPostModel,
    @GetReqUser('reqUser') reqUser: ReqUserModel,
  ): Promise<PostDisplayModel | BlogsError> {
    return this.getResult(
      await this._postsService.createBlogPost(data, reqUser),
    );
  }

  @ApiOperation({
    summary: 'Get all posts.',
  })
  @ApiPagedCollectionResponse(PostDisplayModel)
  @ApiQuery(PaginationSearchTerm(['title']))
  @ApiQuery(PaginationSkip)
  @ApiQuery(PaginationTake)
  @ApiQuery({
    required: false,
    name: 'include',
    isArray: true,
    enum: ['user'],
  })
  @Get()
  async getPostList(
    @Query() query: ListApiQueryDto,
  ): Promise<PagedCollection<PostDisplayModel> | BlogsError> {
    return this.getResult(await this._postsService.getPostList(query));
  }

  @ApiOperation({
    summary: 'Get a post by ID.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostDisplayModel,
  })
  @ApiQuery({
    required: false,
    name: 'include',
    isArray: true,
    enum: ['user'],
  })
  @Get(':postId')
  async getPostById(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Query() query: ListApiQueryDto,
  ): Promise<PostDisplayModel | BlogsError> {
    return this.getResult(await this._postsService.getPostById(postId, query));
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostDisplayModel,
  })
  @ApiBody({
    type: [JsonPatchDocumentDto],
    description: JsonPatchDescription,
  })
  @Patch(':postId')
  @ApiResponse({ status: HttpStatus.OK, type: PostDisplayModel })
  async updatePost(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Body(new PatchValidationPipe(PostEnum, AddPostModel))
    data: any,
    @GetReqUser('reqUser') reqUser: ReqUserModel,
  ): Promise<PostDisplayModel | BlogsError> {
    return this.getResult(
      await this._postsService.updatePost(postId, data, reqUser),
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BoolResult,
  })
  @Delete(':postId')
  @HttpCode(200)
  async deletePost(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @GetReqUser('reqUser') reqUser: ReqUserModel,
  ): Promise<boolean | BlogsError> {
    return this.getResult(await this._postsService.deletePost(postId, reqUser));
  }
}
