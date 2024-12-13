import { Practitioner } from '@shared/business/entities/Practitioner';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { User } from '@shared/business/entities/User';
import { UserFactory } from '@shared/business/entities/factories/UserFactory';

describe('UserFactory', () => {
  describe('getClass', () => {
    it('should return "Practitioner" class type if role is "privatePractitioner"', () => {
      const TEST_USER = { role: ROLES.privatePractitioner };
      const userFactory = new UserFactory(TEST_USER);
      const classInstance = userFactory.getClass();
      expect(classInstance).toEqual(Practitioner);
    });

    it('should return "Practitioner" class type if role is "irsPractitioner"', () => {
      const TEST_USER = { role: ROLES.irsPractitioner };
      const userFactory = new UserFactory(TEST_USER);
      const classInstance = userFactory.getClass();
      expect(classInstance).toEqual(Practitioner);
    });

    it('should return "Practitioner" class type if role is "inactivePractitioner"', () => {
      const TEST_USER = { role: ROLES.inactivePractitioner };
      const userFactory = new UserFactory(TEST_USER);
      const classInstance = userFactory.getClass();
      expect(classInstance).toEqual(Practitioner);
    });

    it('should return "User" class type if role is "admin"', () => {
      const TEST_USER = { role: ROLES.admin };
      const userFactory = new UserFactory(TEST_USER);
      const classInstance = userFactory.getClass();
      expect(classInstance).toEqual(User);
    });
  });
});
