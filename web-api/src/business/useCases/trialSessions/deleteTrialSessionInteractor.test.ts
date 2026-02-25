import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { deleteTrialSessionInteractor } from './deleteTrialSessionInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { deleteTrialSessionWorkingCopy as deleteTrialSessionWorkingCopyMock } from '@web-api/persistence/postgres/trialSessions/deleteTrialSessionWorkingCopy';
import { deleteTrialSession as deleteTrialSessionMock} from '@web-api/persistence/postgres/trialSessions/deleteTrialSession';

describe('deleteTrialSessionInteractor', () => {
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const deleteTrialSessionWorkingCopy = jest.mocked(deleteTrialSessionWorkingCopyMock);
  const deleteTrialSession = jest.mocked(deleteTrialSessionMock);

  let mockTrialSession;

  beforeAll(() => {
    getTrialSessionById.mockImplementation(() => mockTrialSession);
  });

  beforeEach(() => {
    mockTrialSession = MOCK_TRIAL_REGULAR;

    applicationContext.environment.stage = 'local';
  });

  it('throws error if user is unauthorized', async () => {
    await expect(
      deleteTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('throws an exception when it fails to find a trial session', async () => {
    mockTrialSession = null;

    await expect(
      deleteTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(
      'Trial session c54ba5a9-b37b-479d-9201-067ec6e335bb was not found.',
    );
  });

  it('throws error when trial session start date is in the past', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
    };

    await expect(
      deleteTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Trial session cannot be updated after its start date');
  });

  it('throws error if trial session is calendared', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
      startDate: '2100-12-01T00:00:00.000Z',
    };

    await expect(
      deleteTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Trial session cannot be deleted after it is calendared');
  });

  it('deletes the trial session and processes empty caseOrder without updating cases', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      caseOrder: [],
      startDate: '2100-12-01T00:00:00.000Z',
    };

    getCasesByDocketNumbers.mockResolvedValueOnce([]);

    await deleteTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations).not.toHaveBeenCalled();
    expect(deleteTrialSession).toHaveBeenCalled();
  });

  it('deletes the trial session and invokes expected persistence methods', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      startDate: '2100-12-01T00:00:00.000Z',
    };

    getCasesByDocketNumbers.mockResolvedValue([MOCK_CASE]);

    await deleteTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockDocketClerkUser,
    );

    expect(
      deleteTrialSessionWorkingCopy,
    ).toHaveBeenCalled();
    expect(
      deleteTrialSession,
    ).toHaveBeenCalled();
    expect(updateCaseAndAssociations).toHaveBeenCalled();
  });

  it('does not delete the trial session working copy if there is no judge on the trial session', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      judge: null,
      startDate: '2100-12-01T00:00:00.000Z',
    };

    getCasesByDocketNumbers.mockResolvedValue([MOCK_CASE]);

    await deleteTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockDocketClerkUser,
    );

    expect(
      deleteTrialSessionWorkingCopy,
    ).not.toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      startDate: '2100-12-01T00:00:00.000Z',
    };
    getCasesByDocketNumbers.mockResolvedValue([MOCK_CASE]);
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      deleteTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCasesByDocketNumbers).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      startDate: '2100-12-01T00:00:00.000Z',
    };

    getCasesByDocketNumbers.mockResolvedValue([MOCK_CASE]);

    await deleteTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockDocketClerkUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });
});
