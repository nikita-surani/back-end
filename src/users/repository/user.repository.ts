import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../models';

export interface IUsersRepository {
  save(user: Users): Promise<Users>;
  getById(id: string): Promise<Users>;
  getUserByEmail(email: string): Promise<Users>;
}

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(Users)
    private readonly _userRepository: Repository<Users>,
  ) {}

  public async save(user: Users): Promise<Users> {
    return await this._userRepository.save(user);
  }

  public async getById(id: string): Promise<Users> {
    const queryable = this._userRepository
      .createQueryBuilder('users')
      .where('users.id =:id', {
        id,
      });

    return await queryable.getOne();
  }

  public async getUserByEmail(email: string): Promise<Users> {
    const queryable = this._userRepository
      .createQueryBuilder('users')
      .where('users.email_address =:email', {
        email,
      });
    return await queryable.getOne();
  }
}
