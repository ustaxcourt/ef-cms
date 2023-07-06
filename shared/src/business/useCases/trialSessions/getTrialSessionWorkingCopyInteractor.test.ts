import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { MOCK_TRIAL_SESSION_WORKING_COPY } from '../../../test/mockTrialSessionWorkingCopy';
import { ROLES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '../../../errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  chambersUser,
  judgeUser,
  trialClerkUser,
} from '../../../test/mockUsers';
import { getTrialSessionWorkingCopyInteractor } from './getTrialSessionWorkingCopyInteractor';
import { omit } from 'lodash';

describe('Get trial session working copy', () => {
  let user;

  beforeEach(() => {
    user = judgeUser;

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL_INPERSON);

    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...user,
      section: 'colvinsChambers',
    });

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionWorkingCopy.mockResolvedValue(
        MOCK_TRIAL_SESSION_WORKING_COPY,
      );

    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(judgeUser);
  });

  it('throws error if user is unauthorized', async () => {
    user = {
      role: 'unauthorizedRole',
      userId: 'unauthorizedUser',
    };

    await expect(
      getTrialSessionWorkingCopyInteractor(applicationContext, {
        trialSessionId: MOCK_TRIAL_SESSION_WORKING_COPY.trialSessionId,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionWorkingCopy.mockResolvedValue(
        omit(MOCK_TRIAL_SESSION_WORKING_COPY, 'userId'),
      );

    await expect(
      getTrialSessionWorkingCopyInteractor(applicationContext, {
        trialSessionId: MOCK_TRIAL_SESSION_WORKING_COPY.trialSessionId,
      }),
    ).rejects.toThrow('The TrialSessionWorkingCopy entity was invalid');
  });

  it('correctly returns data from persistence for a judge user (default user for test)', async () => {
    const result = await getTrialSessionWorkingCopyInteractor(
      applicationContext,
      {
        trialSessionId: MOCK_TRIAL_SESSION_WORKING_COPY.trialSessionId,
      },
    );
    expect(result).toMatchObject(MOCK_TRIAL_SESSION_WORKING_COPY);
  });

  it('does not return data if none is returned from persistence', async () => {
    user = {
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
      getTrialSessionWorkingCopyInteractor(applicationContext, {
        trialSessionId: MOCK_TRIAL_SESSION_WORKING_COPY.trialSessionId,
      }),
    ).rejects.toThrow('Trial session working copy not found');
  });

  it('correctly returns data from persistence for a trial clerk user', async () => {
    user = {
      role: ROLES.trialClerk,
      userId: 'a9ae05ba-d48a-43a6-9981-ee536a7601be',
    };
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockImplementation(() => {});

    const result = await getTrialSessionWorkingCopyInteractor(
      applicationContext,
      {
        trialSessionId: MOCK_TRIAL_SESSION_WORKING_COPY.trialSessionId,
      },
    );
    expect(
      applicationContext.getPersistenceGateway().getTrialSessionWorkingCopy.mock
        .calls[0][0],
    ).toMatchObject({
      userId: 'a9ae05ba-d48a-43a6-9981-ee536a7601be',
    });
    expect(result).toMatchObject(MOCK_TRIAL_SESSION_WORKING_COPY);
  });

  describe('conditionally creates a trial session working copy if it does not exist', () => {
    beforeEach(() => {
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionWorkingCopy.mockResolvedValue(undefined);
      applicationContext
        .getUseCaseHelpers()
        .getJudgeInSectionHelper.mockReturnValue(judgeUser);
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({ MOCK_TRIAL_INPERSON });
    });

    it('for current user who is a judge on this trial session with no assigned trial clerk', async () => {
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValueOnce({
          ...MOCK_TRIAL_INPERSON,
          judge: judgeUser,
          trialClerk: undefined,
        });
      applicationContext.getCurrentUser.mockReturnValue(judgeUser);

      const result = await getTrialSessionWorkingCopyInteractor(
        applicationContext,
        {
          trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
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
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
      });
    });

    it('for current user who is a trial clerk on this trial session', async () => {
      applicationContext
        .getUseCaseHelpers()
        .getJudgeInSectionHelper.mockReturnValueOnce(undefined);
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockResolvedValue({
          ...MOCK_TRIAL_INPERSON,
          judge: undefined,
          trialClerk: trialClerkUser,
        });
      applicationContext.getCurrentUser.mockReturnValue(trialClerkUser);

      const result = await getTrialSessionWorkingCopyInteractor(
        applicationContext,
        {
          trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
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
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
      });
    });

    it('for current user who is a chambers user whose associated judge is on this trial session', async () => {
      applicationContext.getCurrentUser.mockReturnValue(chambersUser);
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...MOCK_TRIAL_INPERSON,
          judge: judgeUser,
        });

      const result = await getTrialSessionWorkingCopyInteractor(
        applicationContext,
        {
          trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
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
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
      });
    });
  });
});
