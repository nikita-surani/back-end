import { Injectable } from '@nestjs/common';
import { Comments } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListApiQueryDto } from '../../core/dto';

export interface ICommentsRepository {
  save(post: Comments): Promise<Comments>;

  getPostCommentList(
    postId: string,
    query: ListApiQueryDto,
  ): Promise<[Comments[], number]>;
}

@Injectable()
export class CommentsRepository implements ICommentsRepository {
  constructor(
    @InjectRepository(Comments)
    private readonly _postsRepository: Repository<Comments>,
  ) {}

  public async save(post: Comments): Promise<Comments> {
    return await this._postsRepository.save(post);
  }
  public async getPostCommentList(
    postId: string,
    query: ListApiQueryDto,
  ): Promise<[Comments[], number]> {
    const sortBy = 'comments._auditInfo._createdAt';

    if (query.pageNumber > 1) {
      query.skip = (query.pageNumber - 1) * query.take;
    }

    let queryable = this._postsRepository
      .createQueryBuilder('comments')
      .where(' comments.post_id = :postId', {
        postId,
      });

    //join the users table to include user data in the results.
    if (query.include && query.include.includes('user')) {
      queryable = queryable.leftJoinAndSelect('comments._user', 'users');
    }

    //join the posts table to include post data in the results.
    if (query.include && query.include.includes('post')) {
      queryable = queryable.leftJoinAndSelect('comments._post', 'posts');
    }

    if (query.searchTerm) {
      queryable = queryable.andWhere('comments.content ILIKE :searchTerm', {
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
}
