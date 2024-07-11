import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Inject, Injectable } from '@nestjs/common';
import { WinstonLogger } from '../../utils/logger';
import { UsersRepository } from '../repository';
import { IUsersRepository } from '../repository/user.repository';
import { Users } from '../models';
import { AddUserModel, UserDisplayModel } from '../dto';
import { BlogsError } from '../../utils/errors';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ErrorCreatingItem, ErrorDuplicateItem } from '../../core/error-codes';
import { UserErrorCodes, UserResourceNames } from '../error-codes';

@Injectable()
export class UsersService {
  constructor(
    @InjectMapper()
    private readonly _mapper: Mapper,
    private readonly _logger: WinstonLogger,

    @Inject(UsersRepository)
    private readonly _usersRepository: IUsersRepository,
  ) {
    this._logger.setScope(__filename);
  }
  async createUser(
    model: AddUserModel,
  ): Promise<UserDisplayModel | BlogsError> {
    try {
      this._logger.info(
        ` Executing add  user detail with Payload: ${JSON.stringify(model)}.`,
      );

      // Check for existing user by email
      const existingUser = await this._usersRepository.getUserByEmail(
        model.emailAddress,
      );

      if (existingUser) {
        return new ErrorDuplicateItem(
          UserResourceNames.UserNameSingular,
          UserErrorCodes.ErrUserAlreadyExist,
         `Email: ${model.emailAddress}`,
        );
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(model.password, salt);

      // Create a new admin user
      const newAdmin = new Users(
        uuid(), // Generate a new UUID for the user
        model.firstName,
        model.lastName,
        model.userName,
        model.emailAddress,
        hashPassword,
      );

      const outcome = await this._usersRepository.save(newAdmin);

      const displayModel = this._mapper.map(outcome, Users, UserDisplayModel);
      this._logger.info(
        ` Successfully added admin detail with Id: ${newAdmin.id}.`,
      );

      return displayModel;
    } catch (ex) {
      const error = new ErrorCreatingItem(
        'users',
        'CreateUser',
        'Failed to create user',
        ex,
      );
      this._logger.error(error.message, ex);
      return error;
    }
  }
}
