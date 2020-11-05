const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  createTrialSessionAndWorkingCopy,
} = require('./createTrialSessionAndWorkingCopy');
const { omit } = require('lodash');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');

const DATE = '2018-11-21T20:49:28.192Z';

const trialSessionMetadata = {
  isCalendared: false,
  judge: { name: 'Buch', userId: 'd90e7b8c-c8a1-4b96-9b30-70bd47b63df0' },
  maxCases: 100,
  sessionType: 'Hybrid',
  startDate: DATE,
  term: 'Fall',
  termYear: '2018',
  trialLocation: 'Chicago, Illinois',
  trialSessionId: 'a54ba5a9-b37b-479d-9201-067ec6e335cc',
};
let trialSessionToAdd;

describe('createTrialSessionAndWorkingCopy', () => {
  beforeEach(() => {
    trialSessionToAdd = new TrialSession(trialSessionMetadata, {
      applicationContext,
    });

    applicationContext
      .getPersistenceGateway()
      .createTrialSession.mockReturnValue(trialSessionMetadata);
  });

  it('should create a trial session successfully', async () => {
    const result = await createTrialSessionAndWorkingCopy({
      applicationContext,
      trialSessionToAdd,
    });
    expect(result).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().createTrialSession,
    ).toHaveBeenCalled();
  });

  it('should create a corresponding trial session working copy when it contains a judge with a valid userId', async () => {
    await createTrialSessionAndWorkingCopy({
      applicationContext,
      trialSessionToAdd,
    });

    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy,
    ).toHaveBeenCalled();
  });

  it('should create a corresponding trial session working copy when it contains a trialClerk with a valid userId', async () => {
    delete trialSessionMetadata.judge;
    trialSessionMetadata.trialClerk = {
      name: 'Test Clerk',
      userId: 'd90e7b8c-c8a1-4b96-9b30-70bd47b63df0',
    };
    await createTrialSessionAndWorkingCopy({
      applicationContext,
      trialSessionToAdd,
    });

    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy,
    ).toHaveBeenCalled();
  });

  describe('validation', () => {
    it('should fail to migrate a trial session when the trial session metadata is invalid', async () => {
      await expect(
        createTrialSessionAndWorkingCopy({
          applicationContext,
          trialSessionToAdd: new TrialSession(
            {
              trialSessionId: 'a54ba5a9-b37b-479d-9201-067ec6e335cc',
            },
            { applicationContext },
          ),
        }),
      ).rejects.toThrow('The TrialSession entity was invalid');
    });

    it('should fail to migrate a trial session when the trialSessionId is not provided', async () => {
      await expect(
        createTrialSessionAndWorkingCopy({
          applicationContext,
          trialSessionToAdd: omit(trialSessionToAdd, 'trialSessionId'),
        }),
      ).rejects.toThrow(
        'The TrialSessionWorkingCopy entity was invalid. {"trialSessionId":"\'trialSessionId\' is required"}. {"trialSessionId":"<undefined>","userId":"d90e7b8c-c8a1-4b96-9b30-70bd47b63df0"}',
      );
    });
  });
});
