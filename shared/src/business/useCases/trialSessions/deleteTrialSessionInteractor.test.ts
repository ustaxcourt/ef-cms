import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { ROLES } from '../../entities/EntityConstants';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { deleteTrialSessionInteractor } from './deleteTrialSessionInteractor';

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
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Docket Clerk',
        role: ROLES.docketClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
  });

  it('throws error if user is unauthorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });

    await expect(
      deleteTrialSessionInteractor(applicationContext, {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('throws an exception when it fails to find a trial session', async () => {
    mockTrialSession = null;

    await expect(
      deleteTrialSessionInteractor(applicationContext, {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow(
      'Trial session c54ba5a9-b37b-479d-9201-067ec6e335bb was not found.',
    );
  });

  it('throws error when trial session start date is in the past', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
    };

    await expect(
      deleteTrialSessionInteractor(applicationContext, {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Trial session cannot be updated after its start date');
  });

  it('throws error if trial session is calendared', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
      startDate: '2100-12-01T00:00:00.000Z',
    };

    await expect(
      deleteTrialSessionInteractor(applicationContext, {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
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

    await deleteTrialSessionInteractor(applicationContext, {
      trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

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

    await deleteTrialSessionInteractor(applicationContext, {
      trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

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

    await deleteTrialSessionInteractor(applicationContext, {
      trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

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
      deleteTrialSessionInteractor(applicationContext, {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
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

    await deleteTrialSessionInteractor(applicationContext, {
      trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
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
