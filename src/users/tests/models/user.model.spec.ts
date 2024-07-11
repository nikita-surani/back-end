import { AuditInfo } from '../../../core/domain';
import { Users } from '../../../users/models';

describe('Users Entity', () => {
  const mockId = 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6';
  const mockFirstName = 'John';
  const mockLastName = 'Doe';
  const mockUserName = 'john_doe';
  const mockEmailAddress = 'john.doe@example.com';
  const mockPassword = 'SecurePass123!';
  const mockCreatedBy = 'admin';

  describe('Constructor', () => {
    it('should create a new instance of Users entity', () => {
      const user = new Users(
        mockId,
        mockFirstName,
        mockLastName,
        mockUserName,
        mockEmailAddress,
        mockPassword,
        mockCreatedBy,
      );

      expect(user).toBeInstanceOf(Users);
      expect(user.id).toEqual(mockId);
      expect(user.firstName).toEqual(mockFirstName);
      expect(user.lastName).toEqual(mockLastName);
      expect(user.userName).toEqual(mockUserName);
      expect(user.emailAddress).toEqual(mockEmailAddress);
      expect(user.password).toEqual(mockPassword);
      expect(user.auditInfo).toBeInstanceOf(AuditInfo);
      expect(user.auditInfo.createdBy).toEqual(mockCreatedBy);
    });
  });
});
