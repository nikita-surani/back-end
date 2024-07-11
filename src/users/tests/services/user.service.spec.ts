/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { Mapper, createMapper } from '@automapper/core';
import { getMapperToken } from '@automapper/nestjs';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { classes } from '@automapper/classes';
import { mockUserRepository } from '../mock-data/user-mock.repository';
import { UserMapperProfile } from '../../../users/mappings/user-mapper';
import { UsersService } from '../../../users/services/user.service';
import { UsersRepository } from '../../../users/repository';
import { AddUserModel, UserDisplayModel } from '../../../users/dto';
import {
  ErrorCreatingItem,
  ErrorDuplicateItem,
} from '../../../core/error-codes';
import { WinstonLogger } from '../../../utils/logger';
import { Users } from '../../../users/models';
import { AuditInfoMapperProfile } from '../../../core/mappings';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository;
  let mapper: Mapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        WinstonLogger,
        UserMapperProfile,
        AuditInfoMapperProfile,
        {
          provide: UsersRepository,
          useValue: mockUserRepository(),
        },
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: classes(),
          }),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<UsersRepository>(UsersRepository);
    mapper = module.get<Mapper>(getMapperToken());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const mockModel: AddUserModel = {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johndoe',
      emailAddress: 'johndoe@example.com',
      password: 'password',
    };

    it('should create a new user successfully', async () => {
      const mockUser = new Users(
        uuid(),
        mockModel.firstName,
        mockModel.lastName,
        mockModel.userName,
        mockModel.emailAddress,
        'hashedPassword', // Assuming this is the hashed password
      );

      userRepository.getUserByEmail.mockResolvedValue(null);
      bcrypt.genSalt = jest.fn().mockResolvedValue('mockSalt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.createUser(mockModel);

      expect(result).toBeInstanceOf(UserDisplayModel);
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        mockModel.emailAddress,
      );
    });

    it('should return ErrorDuplicateItem if user already exists', async () => {
      const existingUser = new Users(
        uuid(),
        mockModel.firstName,
        mockModel.lastName,
        mockModel.userName,
        mockModel.emailAddress,
        'hashedPassword', // Assuming this is the hashed password
      );

      userRepository.getUserByEmail.mockResolvedValue(existingUser);

      const result = await service.createUser(mockModel);

      expect(result).toBeInstanceOf(ErrorDuplicateItem);
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        mockModel.emailAddress,
      );
      expect(userRepository.save).not.toHaveBeenCalled();
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('should return ErrorCreatingItem when an error occurs during user creation', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);
      bcrypt.genSalt = jest.fn().mockRejectedValue(new Error('Test error'));

      const result = await service.createUser(mockModel);

      expect(result).toBeInstanceOf(ErrorCreatingItem);
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        mockModel.emailAddress,
      );
      expect(userRepository.save).not.toHaveBeenCalled();
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });
});
