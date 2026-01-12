import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { RawTrialSession, TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { createTrialSessionAndWorkingCopy } from './createTrialSessionAndWorkingCopy';
import { createTrialSessionWorkingCopy as createTrialSessionWorkingCopyMock } from '@web-api/persistence/postgres/trialSessions/createTrialSessionWorkingCopy';
import { createTrialSession as createTrialSessionMock } from '@web-api/persistence/postgres/trialSessions/createTrialSession';

const DATE = '2018-11-21T20:49:28.192Z';

const trialSessionMetadata: RawTrialSession = {
  isCalendared: false,
  judge: { name: 'Buch', userId: 'd90e7b8c-c8a1-4b96-9b30-70bd47b63df0' },
  maxCases: 100,
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
  sessionType: SESSION_TYPES.hybrid,
  startDate: DATE,
  term: 'Fall',
  termYear: '2018',
  trialLocation: 'Chicago, Illinois',
  trialSessionId: 'a54ba5a9-b37b-479d-9201-067ec6e335cc',
  caseOrder: [],
  hasNottBeenServed: false,
  sessionScope: 'Location-based',
  sessionStatus: '',
  paperServicePdfs: []
};
let trialSessionToAdd;

describe('createTrialSessionAndWorkingCopy', () => {

  const createTrialSessionWorkingCopy = jest.mocked(createTrialSessionWorkingCopyMock);
  const createTrialSession = jest.mocked(createTrialSessionMock);

  beforeEach(() => {
    trialSessionToAdd = new TrialSession(trialSessionMetadata);

    createTrialSession.mockResolvedValue(trialSessionMetadata);
  });

  it('should create a trial session successfully', async () => {
    const result = await createTrialSessionAndWorkingCopy({
      trialSessionToAdd,
    });
    expect(result).toBeDefined();
    expect(
      createTrialSession,
    ).toHaveBeenCalledTimes(1);
  });

  it('should create no corresponding trial session working copy without a valid judge userId or trialClerk userId', async () => {
    delete trialSessionToAdd.judge;
    delete trialSessionToAdd.trialClerk;
    await createTrialSessionAndWorkingCopy({
      trialSessionToAdd,
    });

    expect(
      createTrialSessionWorkingCopy,
    ).not.toHaveBeenCalled();
  });

  it('should create a corresponding trial session working copy when it contains a judge with a valid userId', async () => {
    await createTrialSessionAndWorkingCopy({
      trialSessionToAdd,
    });

    expect(
      createTrialSessionWorkingCopy,
    ).toHaveBeenCalledTimes(1);
  });

  it('should create a corresponding trial session working copy when it contains a trialClerk with a valid userId', async () => {
    trialSessionToAdd.trialClerk = {
      name: 'Test Clerk',
      userId: 'd90e7b8c-c8a1-4b96-9b30-70bd47b63df0',
    };
    await createTrialSessionAndWorkingCopy({
      trialSessionToAdd,
    });
    expect(
      createTrialSessionWorkingCopy,
    ).toHaveBeenCalledTimes(2);
  });

  describe('validation', () => {
    it('should fail to migrate a trial session when the trial session metadata is invalid', async () => {
      await expect(
        createTrialSessionAndWorkingCopy({
          trialSessionToAdd: new TrialSession({
            trialSessionId: 'a54ba5a9-b37b-479d-9201-067ec6e335cc',
          }),
        }),
      ).rejects.toThrow('The TrialSession entity was invalid');
    });
  });
});
