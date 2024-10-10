import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { MOCK_TRIAL_REGULAR } from '../../../../../shared/src/test/mockTrial';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteTrialSessionInteractor } from './deleteTrialSessionInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('deleteTrialSessionInteractor', () => {
  let mockTrialSession;
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => mockTrialSession);
  });

  beforeEach(() => {
    mockLock = undefined;
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

  it('deletes the trial session and invokes expected persistence methods', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      startDate: '2100-12-01T00:00:00.000Z',
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    await deleteTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().deleteTrialSessionWorkingCopy,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('does not delete the trial session working copy if there is no judge on the trial session', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      judge: null,
      startDate: '2100-12-01T00:00:00.000Z',
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    await deleteTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().deleteTrialSessionWorkingCopy,
    ).not.toHaveBeenCalled();
  });

  it('should not call createCaseTrialSortMappingRecords if the case has no trial city', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      startDate: '2100-12-01T00:00:00.000Z',
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        preferredTrialCity: null,
      });

    await deleteTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      startDate: '2100-12-01T00:00:00.000Z',
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    mockLock = MOCK_LOCK;

    await expect(
      deleteTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      startDate: '2100-12-01T00:00:00.000Z',
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    await deleteTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockDocketClerkUser,
    );
    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledTimes(mockTrialSession.caseOrder.length);

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });
});
