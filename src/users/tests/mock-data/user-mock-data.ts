import { ReqUserModel } from '../../../core/domain/dto';
import { Users } from '../../../users/models';
import { v4 as uuid } from 'uuid';

const mockUserId = uuid();
export const mockUserData = new Users(
  mockUserId,
  'firstName',
  'lastName',
  'userName',
  'example12@gmail.com',
  'password',
  null,
);

export const mockReqUser: ReqUserModel = {
  id: mockUserData.id,
  name: 'name',
  token: 'token',
};
