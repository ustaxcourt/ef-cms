import { AuthUser, isAuthUser } from './AuthUser';
import { ROLES } from '@shared/business/entities/EntityConstants';

describe('AuthUser', () => {
  describe('isAuthUser', () => {
    it('should return false if AuthUser is invalid', () => {
      const user = {
        email: 'test@e.mail',
        role: ROLES.admissionsClerk,
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      };

      expect(isAuthUser(user)).toBe(false);
    });

    it('should return false if AuthUser is missing role', () => {
      const user = {
        email: 'test@e.mail',
        name: 'Billy',
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      };

      expect(isAuthUser(user)).toBe(false);
    });

    it('should return false if AuthUser is missing userId', () => {
      const user = {
        email: 'test@e.mail',
        name: 'Billy',
        role: ROLES.admissionsClerk,
      };

      expect(isAuthUser(user)).toBe(false);
    });

    it('should return false if AuthUser is missing email', () => {
      const user = {
        name: 'Billy',
        role: ROLES.admissionsClerk,
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      };

      expect(isAuthUser(user)).toBe(false);
    });

    it('should return true if user is AuthUser', () => {
      const user = {
        email: 'test@e.mail',
        name: 'Jane Smith',
        role: ROLES.admissionsClerk,
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      } as AuthUser;

      expect(isAuthUser(user)).toBe(true);
    });
  });
});
