import { ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getJudgeForUserHelper } from './getJudgeForUserHelper';
import {
  mockChambersUser,
  mockDocketClerkUser,
  mockJudgeUser,
} from '@shared/test/mockAuthUsers';
import { validUser } from '@shared/test/mockUsers';

describe('getJudgeForUserHelper', () => {
  const judgeUser = {
    ...validUser,
    contact: { phone: validUser.contact?.phone },
    role: ROLES.judge,
    section: 'judgeChambers',
  };

  const chambersUser = {
    ...validUser,
    role: ROLES.chambers,
    section: 'judgeChambers',
  };

  const docketClerkUser = {
    ...validUser,
    role: ROLES.docketClerk,
    section: 'docket',
  };

  let mockFoundUser;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockFoundUser);
  });

  describe('Judge User', () => {
    beforeAll(() => {
      mockFoundUser = mockJudgeUser;
    });

    it('retrieves the specified user from the database by its userId', async () => {
      await getJudgeForUserHelper(applicationContext, { user: mockJudgeUser });

      expect(
        applicationContext.getPersistenceGateway().getUserById,
      ).toHaveBeenCalledWith({
        applicationContext,
        userId: mockFoundUser.userId,
      });
    });

    it('returns the retrieved judge from the database', async () => {
      const result = await getJudgeForUserHelper(applicationContext, {
        user: mockJudgeUser,
      });
      expect(result).toMatchObject(mockJudgeUser);
    });
  });

  describe('Chambers User', () => {
    beforeAll(() => {
      mockFoundUser = chambersUser;
      applicationContext
        .getUseCaseHelpers()
        .getJudgeInSectionHelper.mockReturnValue(judgeUser);
    });

    it('calls getJudgeInSectionHelper with the retrieved user`s section if they are a chambers user', async () => {
      await getJudgeForUserHelper(applicationContext, {
        user: mockChambersUser,
      });

      expect(
        applicationContext.getUseCaseHelpers().getJudgeInSectionHelper,
      ).toHaveBeenCalledWith(applicationContext, {
        section: chambersUser.section,
      });
    });

    it('returns the user that getJudgeInSectionHelper found', async () => {
      const result = await getJudgeForUserHelper(applicationContext, {
        user: mockJudgeUser,
      });
      expect(result).toMatchObject(judgeUser);
    });

    it('throws an error if it could not find a judge user with getJudgeInSectionHelper', async () => {
      applicationContext
        .getUseCaseHelpers()
        .getJudgeInSectionHelper.mockReturnValue(undefined);

      await expect(
        getJudgeForUserHelper(applicationContext, {
          user: mockDocketClerkUser,
        }),
      ).rejects.toThrow(
        `Could not find Judge for Chambers Section ${chambersUser.section}`,
      );
    });
  });

  describe('Docket Clerk', () => {
    it('throws an error if the user is netiher judge nor chambers', async () => {
      mockFoundUser = docketClerkUser;
      await expect(
        getJudgeForUserHelper(applicationContext, {
          user: mockDocketClerkUser,
        }),
      ).rejects.toThrow(
        'Could not get Judge User ID for non Judge or Chambers User',
      );
    });
  });
});
