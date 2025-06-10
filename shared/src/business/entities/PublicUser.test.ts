import { ROLES } from '@shared/business/entities/EntityConstants';
import { PublicUser } from './PublicUser';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';

describe('PublicUser entity', () => {
  describe('validation', () => {
    it('should fail validation when role is not provided', () => {
      const publicUser = new PublicUser({});

      const errors = publicUser.getFormattedValidationErrors();
      expect(errors).toMatchObject({
        name: 'Enter name',
        role: 'Role is required',
      });
    });

    it('fails validation when role is not provided', () => {
      const publicUser = new PublicUser({
        name: 'Test User',
      });

      expect(publicUser.getFormattedValidationErrors()).toMatchObject({
        role: 'Role is required',
      });
    });

    it('fails validation when name is not provided', () => {
      const publicUser = new PublicUser({
        role: ROLES.petitionsClerk,
      });

      expect(publicUser.getFormattedValidationErrors()).toMatchObject({
        name: 'Enter name',
      });
    });

    it('fails validation when role is not a recognized role', () => {
      const publicUser = new PublicUser({
        name: 'Test User',
        role: 'NotARealRole',
      });

      const errors = publicUser.getFormattedValidationErrors();
      expect(errors).toMatchObject({
        role: expect.stringContaining('Role is required'),
      });
    });

    it('passes validation when role is recognized and name is provided', () => {
      const publicUser = new PublicUser({
        name: 'Test User',
        role: ROLES.petitionsClerk,
      });

      expect(publicUser.getFormattedValidationErrors()).toBeNull();
    });

    it('fails validation when role = judge but judgeFullName is missing', () => {
      const publicUser = new PublicUser({
        name: 'Judge Person',
        // judgeFullName intentionally missing
        judgeTitle: 'Special Judge Title',
        role: ROLES.judge,
      });

      const errors = publicUser.getFormattedValidationErrors();
      expect(errors).toMatchObject({
        judgeFullName: expect.stringContaining('"judgeFullName" is required'),
      });
    });

    it('fails validation when role = judge but judgeTitle is missing', () => {
      const publicUser = new PublicUser({
        judgeFullName: 'Judge Wapner',
        name: 'Judge Person',
        // judgeTitle intentionally missing
        role: ROLES.judge,
      });

      const errors = publicUser.getFormattedValidationErrors();
      expect(errors).toMatchObject({
        judgeTitle: expect.stringContaining('"judgeTitle" is required'),
      });
    });

    it('passes validation when role = judge and both judgeFullName & judgeTitle provided', () => {
      const publicUser = new PublicUser({
        judgeFullName: 'Judge Wapner',
        judgeTitle: 'Special Judge Title',
        name: 'Judge Person',
        role: ROLES.judge,
      });

      const errors = publicUser.getFormattedValidationErrors();
      expect(errors).toBeNull();
    });

    it('passes validation when role = legacyJudge, even if judgeFullName or judgeTitle are not required by the schema', () => {
      const publicUser = new PublicUser({
        judgeFullName: 'Legacy Judge Doe',
        judgeTitle: 'Retired Title',
        name: 'Legacy Judge Person',
        role: ROLES.legacyJudge,
      });

      expect(publicUser.getFormattedValidationErrors()).toBeNull();
    });

    it('passes validation for legacyJudge even if judgeTitle / judgeFullName are missing (not required in the schema)', () => {
      const publicUser = new PublicUser({
        name: 'Legacy Judge Person',
        role: ROLES.legacyJudge,
        // no judgeTitle or judgeFullName
      });

      expect(publicUser.getFormattedValidationErrors()).toBeNull();
    });
  });

  describe('constructor behavior', () => {
    it('sets judgeFullName and judgeTitle if role is judge', () => {
      const rawUser = {
        judgeFullName: 'Judge Judy',
        judgeTitle: 'TV Judge Title',
        name: 'Judy',
        role: ROLES.judge,
      };
      const publicUser = new PublicUser(rawUser);

      expect(publicUser.judgeFullName).toBe(rawUser.judgeFullName);
      expect(publicUser.judgeTitle).toBe(rawUser.judgeTitle);
    });

    it('sets judgeFullName and judgeTitle if role is legacyJudge', () => {
      const rawUser = {
        judgeFullName: 'Legacy Judge Name',
        judgeTitle: 'Legacy Judge Title',
        name: 'Judge Person',
        role: ROLES.legacyJudge,
      };
      const publicUser = new PublicUser(rawUser);

      expect(publicUser.judgeFullName).toBe(rawUser.judgeFullName);
      expect(publicUser.judgeTitle).toBe(rawUser.judgeTitle);
    });

    it('does not set judgeFullName or judgeTitle if role is not judge/legacyJudge', () => {
      const rawUser = {
        name: 'Test Person',
        judgeFullName: 'Should Not Appear',
        judgeTitle: 'Should Not Appear Either',
        role: ROLES.petitionsClerk,
      };
      const publicUser = new PublicUser(rawUser);

      expect(publicUser.judgeFullName).toBeUndefined();
      expect(publicUser.judgeTitle).toBeUndefined();
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
