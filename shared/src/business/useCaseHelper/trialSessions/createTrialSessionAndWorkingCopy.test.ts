import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { TrialSessionFactory } from '../../entities/trialSessions/TrialSessionFactory';
import { applicationContext } from '../../test/createTestApplicationContext';
import { createTrialSessionAndWorkingCopy } from './createTrialSessionAndWorkingCopy';

describe('createTrialSessionAndWorkingCopy', () => {
  let trialSessionToAdd: TrialSession;

  beforeEach(() => {
    trialSessionToAdd = TrialSessionFactory(
      MOCK_TRIAL_INPERSON,
      applicationContext,
    );

    applicationContext
      .getPersistenceGateway()
      .createTrialSession.mockReturnValue(MOCK_TRIAL_INPERSON);
  });

  it('should create a trial session successfully', async () => {
    const result = await createTrialSessionAndWorkingCopy({
      applicationContext,
      trialSessionToAdd,
    });
    expect(result).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().createTrialSession,
    ).toHaveBeenCalledTimes(1);
  });

  it('should create no corresponding trial session working copy without a valid judge userId or trialClerk userId', async () => {
    delete trialSessionToAdd.judge;
    delete trialSessionToAdd.trialClerk;
    await createTrialSessionAndWorkingCopy({
      applicationContext,
      trialSessionToAdd,
    });

    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy,
    ).not.toHaveBeenCalled();
  });

  it('should create a corresponding trial session working copy when it contains a judge with a valid userId', async () => {
    await createTrialSessionAndWorkingCopy({
      applicationContext,
      trialSessionToAdd,
    });

    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy,
    ).toHaveBeenCalledTimes(1);
  });

  it('should create a corresponding trial session working copy when it contains a trialClerk with a valid userId', async () => {
    trialSessionToAdd.trialClerk = {
      name: 'Test Clerk',
      userId: 'd90e7b8c-c8a1-4b96-9b30-70bd47b63df0',
    };
    await createTrialSessionAndWorkingCopy({
      applicationContext,
      trialSessionToAdd,
    });
    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy,
    ).toHaveBeenCalledTimes(2);
  });

  describe('validation', () => {
    it('should fail to migrate a trial session when the trial session metadata is invalid', async () => {
      delete (trialSessionToAdd as any).sessionType;

      await expect(
        createTrialSessionAndWorkingCopy({
          applicationContext,
          trialSessionToAdd,
        }),
      ).rejects.toThrow(
        'The OpenTrialSession entity was invalid. {"sessionType":"\'sessionType\' is required"}',
      );
    });

    it('should fail to migrate a trial session when the trialSessionId is not provided', async () => {
      delete (trialSessionToAdd as any).trialSessionId;

      await expect(
        createTrialSessionAndWorkingCopy({
          applicationContext,
          trialSessionToAdd,
        }),
      ).rejects.toThrow(
        'The OpenTrialSession entity was invalid. {"trialSessionId":"\'trialSessionId\' is required"}',
      );
    });
  });
});
