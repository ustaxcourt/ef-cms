import '@web-api/persistence/postgres/users/mocks.jest';
import {
  CHAMBERS_SECTION,
  DOCKET_SECTION,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getJudgeForUserHelper } from './getJudgeForUserHelper';
import {
  mockChambersUser,
  mockDocketClerkUser,
  mockJudgeUser,
} from '@shared/test/mockAuthUsers';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';

const getUserById = getUserByIdMock as jest.Mock;

describe('getJudgeForUserHelper', () => {
  const judgeUserWithSection = {
    ...mockJudgeUser,
    role: ROLES.judge,
    section: CHAMBERS_SECTION,
  };

  const chambersUserWithSection = {
    ...mockChambersUser,
    role: ROLES.chambers,
    section: 'judgeChambers', // Use a section that includes 'Chambers'
  };

  const docketClerkUserWithSection = {
    ...mockDocketClerkUser,
    role: ROLES.docketClerk,
    section: DOCKET_SECTION,
  };

  describe('Judge User', () => {
    beforeEach(() => {
      getUserById.mockResolvedValue(judgeUserWithSection);
    });

    it('retrieves the specified user from the database by its userId', async () => {
      await getJudgeForUserHelper(applicationContext, {
        user: judgeUserWithSection,
      });

      expect(getUserById).toHaveBeenCalledWith({
        userId: judgeUserWithSection.userId,
      });
    });

    it('returns the retrieved judge from the database', async () => {
      const result = await getJudgeForUserHelper(applicationContext, {
        user: judgeUserWithSection,
      });

      expect(result).toMatchObject(judgeUserWithSection);
    });
  });

  describe('Chambers User', () => {
    beforeEach(() => {
      getUserById.mockResolvedValue(chambersUserWithSection);
      applicationContext
        .getUseCaseHelpers()
        .getJudgeInSectionHelper.mockReturnValue(judgeUserWithSection);
    });

    it('calls getJudgeInSectionHelper with the chambers user section', async () => {
      await getJudgeForUserHelper(applicationContext, {
        user: chambersUserWithSection,
      });

      expect(
        applicationContext.getUseCaseHelpers().getJudgeInSectionHelper,
      ).toHaveBeenCalledWith({
        section: chambersUserWithSection.section,
      });
    });

    it('returns the judge found by getJudgeInSectionHelper', async () => {
      const result = await getJudgeForUserHelper(applicationContext, {
        user: chambersUserWithSection,
      });

      expect(result).toMatchObject(judgeUserWithSection);
    });

    it('throws an error if it could not find a judge user with getJudgeInSectionHelper', async () => {
      applicationContext
        .getUseCaseHelpers()
        .getJudgeInSectionHelper.mockReturnValue(undefined);

      await expect(
        getJudgeForUserHelper(applicationContext, {
          user: chambersUserWithSection,
        }),
      ).rejects.toThrow(
        `Could not find Judge for Chambers Section ${chambersUserWithSection.section}`,
      );
    });
  });

  describe('Docket Clerk', () => {
    it('throws an error for non-judge/non-chambers users', async () => {
      getUserById.mockResolvedValueOnce(docketClerkUserWithSection);

      await expect(
        getJudgeForUserHelper(applicationContext, {
          user: docketClerkUserWithSection,
        }),
      ).rejects.toThrow(
        'Could not get Judge User ID for non Judge or Chambers User',
      );
    });

    it('throws an error if the user does not have a section', async () => {
      getUserById.mockResolvedValueOnce({
        ...docketClerkUserWithSection,
        section: undefined,
      });

      await expect(
        getJudgeForUserHelper(applicationContext, {
          user: { ...docketClerkUserWithSection },
        }),
      ).rejects.toThrow(
        `User ${docketClerkUserWithSection.userId} does not have a specified section`,
      );
    });
  });
});
