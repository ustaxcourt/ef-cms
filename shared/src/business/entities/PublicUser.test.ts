import { ROLES } from '@shared/business/entities/EntityConstants';
import { PublicUser } from './PublicUser';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';

describe('PublicUser entity', () => {
  describe('validation', () => {
    it('should fail validation when role is not provided', () => {
      const publicUser = new PublicUser({});

      expect(publicUser.getFormattedValidationErrors()).toMatchObject({
        role: 'Role is required',
      });
    });
    it('should set judge info when role is judge or legacyJudge', () => {
      const judgeUser = new PublicUser({
        role: ROLES.judge,
        judgeFullName: mockJudgeUser.name,
        judgeTitle: 'Judge',
      });

      const legacyJudgeUser = new PublicUser({
        role: ROLES.judge,
        judgeFullName: mockJudgeUser.name,
        judgeTitle: 'Legacy Judge',
      });

      expect(judgeUser.judgeFullName).toBe(mockJudgeUser.name);
      expect(judgeUser.judgeTitle).toBe('Judge');
      expect(legacyJudgeUser.judgeFullName).toBe(mockJudgeUser.name);
      expect(legacyJudgeUser.judgeTitle).toBe('Legacy Judge');
    });
    it('should not set judge info when role is not judge or legacyJudge', () => {
      const judgeUser = new PublicUser({
        role: ROLES.docketClerk,
        judgeFullName: mockJudgeUser.name,
        judgeTitle: 'Judge',
      });

      expect(judgeUser.judgeFullName).toBeFalsy();
      expect(judgeUser.judgeTitle).toBeFalsy();
    });
  });
});
