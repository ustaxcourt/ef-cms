import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessionWorkingCopyInteractor } from './getTrialSessionWorkingCopyInteractor';
import {
  mockChambersUser,
  mockJudgeUser,
  mockPetitionerUser,
  mockTrialClerkUser,
} from '@shared/test/mockAuthUsers';
import { omit } from 'lodash';

const MOCK_WORKING_COPY = {
  sort: 'practitioner',
  sortOrder: 'desc',
  trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
};

describe('Get trial session working copy', () => {
  let user;

  beforeEach(() => {
    user = {
      role: ROLES.judge,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    };

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        judge: {
          name: 'Jake',
          userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
        },
        maxCases: 100,
        sessionType: 'Regular',
        startDate: '2025-03-01T00:00:00.000Z',
        term: 'Fall',
        termYear: '2025',
        trialClerk: {
          name: 'Joe',
          userId: 'ffd90c05-f6cd-442c-a168-202db587f16f',
        },
        trialLocation: 'Birmingham, Alabama',
      });

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...user,
      section: 'colvinsChambers',
    });

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionWorkingCopy.mockResolvedValue(MOCK_WORKING_COPY);

    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue({
        role: ROLES.judge,
        userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
      });
  });

  it('throws error if user is unauthorized', async () => {
    await expect(
      getTrialSessionWorkingCopyInteractor(
        applicationContext,
        {
          trialSessionId: MOCK_WORKING_COPY.trialSessionId,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionWorkingCopy.mockResolvedValue(
        omit(MOCK_WORKING_COPY, 'userId'),
      );

    await expect(
      getTrialSessionWorkingCopyInteractor(
        applicationContext,
        {
          trialSessionId: MOCK_WORKING_COPY.trialSessionId,
        },
        mockJudgeUser,
      ),
    ).rejects.toThrow('The TrialSessionWorkingCopy entity was invalid');
  });

  it('correctly returns data from persistence for a judge user (default user for test)', async () => {
    const result = await getTrialSessionWorkingCopyInteractor(
      applicationContext,
      {
        trialSessionId: MOCK_WORKING_COPY.trialSessionId,
      },
      mockJudgeUser,
    );
    expect(result).toMatchObject(MOCK_WORKING_COPY);
  });

  it('does not return data if none is returned from persistence', async () => {
    user = {
      ...mockJudgeUser,
      name: 'judge who cannot create working copy',
      role: ROLES.judge,
      userId: 'something else',
    };
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionWorkingCopy.mockImplementation(() => {});
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(null);

    await expect(
      getTrialSessionWorkingCopyInteractor(
        applicationContext,
        {
          trialSessionId: MOCK_WORKING_COPY.trialSessionId,
        },
        mockJudgeUser,
      ),
    ).rejects.toThrow('Trial session working copy not found');
  });

  it('correctly returns data from persistence for a trial clerk user', async () => {
    user = mockTrialClerkUser;
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockImplementation(() => {});

    const result = await getTrialSessionWorkingCopyInteractor(
      applicationContext,
      {
        trialSessionId: MOCK_WORKING_COPY.trialSessionId,
      },
      user,
    );
    expect(
      applicationContext.getPersistenceGateway().getTrialSessionWorkingCopy.mock
        .calls[0][0],
    ).toMatchObject({
      userId: mockTrialClerkUser.userId,
    });
    expect(result).toMatchObject(MOCK_WORKING_COPY);
  });

  describe('conditionally creates a trial session working copy if it does not exist', () => {
    beforeEach(() => {
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionWorkingCopy.mockResolvedValue(undefined);
      applicationContext
        .getUseCaseHelpers()
        .getJudgeInSectionHelper.mockReturnValue({
          role: ROLES.judge,
          userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
        });
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          judge: {
            name: 'Jake',
            userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
          },
          maxCases: 100,
          sessionType: 'Regular',
          startDate: '2025-03-01T00:00:00.000Z',
          term: 'Fall',
          termYear: '2025',
          trialClerk: {
            name: 'Joe',
            userId: 'ffd90c05-f6cd-442c-a168-202db587f16f',
          },
          trialLocation: 'Birmingham, Alabama',
        });
    });

    it('for current user who is a judge on this trial session with no assigned trial clerk', async () => {
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValueOnce({
          judge: {
            name: 'Jake',
            userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
          },
          maxCases: 100,
          sessionType: 'Regular',
          startDate: '2025-03-01T00:00:00.000Z',
          term: 'Fall',
          termYear: '2025',
          trialClerk: undefined,
          trialLocation: 'Birmingham, Alabama',
        });
      const result = await getTrialSessionWorkingCopyInteractor(
        applicationContext,
        {
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        {
          ...mockJudgeUser,
          userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
        },
      );
      expect(
        applicationContext.getPersistenceGateway().getTrialSessionById,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway()
          .createTrialSessionWorkingCopy,
      ).toHaveBeenCalled();
      expect(result).toMatchObject({
        entityName: 'TrialSessionWorkingCopy',
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });

    it('for current user who is a trial clerk on this trial session', async () => {
      applicationContext
        .getUseCaseHelpers()
        .getJudgeInSectionHelper.mockReturnValueOnce(undefined);

      const result = await getTrialSessionWorkingCopyInteractor(
        applicationContext,
        {
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        {
          ...mockTrialClerkUser,
          userId: 'ffd90c05-f6cd-442c-a168-202db587f16f',
        },
      );
      expect(
        applicationContext.getPersistenceGateway().getTrialSessionById,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway()
          .createTrialSessionWorkingCopy,
      ).toHaveBeenCalled();
      expect(result).toMatchObject({
        entityName: 'TrialSessionWorkingCopy',
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });

    it('for current user who is a chambers user whose associated judge is on this trial session', async () => {
      const result = await getTrialSessionWorkingCopyInteractor(
        applicationContext,
        {
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        {
          ...mockChambersUser,
          role: ROLES.chambers,
          userId: 'ffd90c05-f6cd-442c-a168-202db587f16f',
        },
      );
      expect(
        applicationContext.getPersistenceGateway().getTrialSessionById,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway()
          .createTrialSessionWorkingCopy,
      ).toHaveBeenCalled();
      expect(result).toMatchObject({
        entityName: 'TrialSessionWorkingCopy',
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });
  });
});
