import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from '../models';
import { ListApiQueryDto } from '../../core/dto';

export interface IPostsRepository {
  save(post: Posts): Promise<Posts>;

  getPostList(query: ListApiQueryDto): Promise<[Posts[], number]>;

  getByIdWithUser(userId: string, postId: string): Promise<Posts>;

  remove(post: Posts): Promise<void>;

  getById(postId: string, include?: string[]): Promise<Posts>;
}

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(
    @InjectRepository(Posts)
    private readonly _postsRepository: Repository<Posts>,
  ) {}

  public async save(post: Posts): Promise<Posts> {
    return await this._postsRepository.save(post);
  }

  public async remove(post: Posts): Promise<void> {
    await this._postsRepository.remove(post);
  }

  public async getPostList(query: ListApiQueryDto): Promise<[Posts[], number]> {
    const sortBy = 'posts._auditInfo._createdAt';

    if (query.pageNumber > 1) {
      query.skip = (query.pageNumber - 1) * query.take;
    }

    let queryable = this._postsRepository.createQueryBuilder('posts');

    if (query.include && query.include.includes('user')) {
      queryable = queryable.leftJoinAndSelect('posts._user', 'users');
    }

    if (query.searchTerm) {
      queryable = queryable.andWhere('posts.title ILIKE :searchTerm', {
        searchTerm: `%${query.searchTerm}%`,
      });
    }
    if (query.take == 0) {
      const total = await queryable.getCount();
      return [[], total];
    }

    return await queryable
      .orderBy(sortBy)
      .skip(query.skip)
      .take(query.take)
      .getManyAndCount();
  }

  public async getByIdWithUser(userId: string, postId: string): Promise<Posts> {
    const queryable = await this._postsRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts._user', 'users')
      .where('posts.user_id = :userId AND posts.id = :postId', {
        userId,
        postId,
      });

    return queryable.getOne();
  }

  public async getById(postId: string, include?: string[]): Promise<Posts> {
    let queryable = await this._postsRepository
      .createQueryBuilder('posts')
      .where(' posts.id = :postId', {
        postId,
      });

    if (include && include.length && include.includes('user')) {
      queryable = queryable.leftJoinAndSelect('posts._user', 'users');
    }

    return queryable.getOne();
  }
}
