import { IUsersRepository } from '../../../users/repository';

export const mockUserRepository = (): IUsersRepository => ({
  save: jest.fn(),
  getById: jest.fn(),
  getUserByEmail: jest.fn(),
});
