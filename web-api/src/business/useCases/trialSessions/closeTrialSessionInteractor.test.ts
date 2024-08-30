import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '../../../../../shared/src/test/mockTrial';
import {
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { closeTrialSessionInteractor } from './closeTrialSessionInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('closeTrialSessionInteractor', () => {
  let mockTrialSession;

  const FUTURE_DATE = '2090-11-25T15:00:00.000Z';
  const PAST_DATE = '2000-11-25T15:00:00.000Z';

  beforeEach(() => {
    mockTrialSession = MOCK_TRIAL_REGULAR;

    applicationContext.environment.stage = 'local';

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => mockTrialSession);
  });

  it('throws error if user is unauthorized', async () => {
    await expect(
      closeTrialSessionInteractor(
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
      closeTrialSessionInteractor(
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

  it('throws error when trial session is not standalone remote', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      startDate: FUTURE_DATE,
    };

    await expect(
      closeTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(
      'Only standalone remote trial sessions can be closed manually',
    );
  });

  it('throws error when trial session start date is in the future', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      startDate: FUTURE_DATE,
    };

    await expect(
      closeTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(
      'Trial session cannot be closed until after its start date',
    );
  });

  it('throws an error when there are active cases on the trial session', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      caseOrder: [
        { docketNumber: MOCK_CASE.docketNumber, removedFromTrial: false },
      ],
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      startDate: PAST_DATE,
    };

    await expect(
      closeTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Trial session cannot be closed with open cases');
  });

  it('does not throw an error when there are no cases on the trial session', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      caseOrder: undefined,
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      startDate: '2025-03-01T00:00:00.000Z',
    };

    await expect(
      closeTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockDocketClerkUser,
      ),
    ).rejects.not.toThrow('Trial session cannot be closed with open cases');
  });

  it('should not close the trial session and throws an error instead', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      caseOrder: [
        { docketNumber: MOCK_CASE.docketNumber, removedFromTrial: true },
        { docketNumber: MOCK_CASE.docketNumber, removedFromTrial: false },
      ],
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      startDate: PAST_DATE,
    };

    await expect(
      closeTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Trial session cannot be closed with open cases');
  });

  it('closes the trial session and invokes expected persistence methods', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      caseOrder: [
        {
          disposition: 'things happen',
          docketNumber: MOCK_CASE.docketNumber,
          removedFromTrial: true,
          removedFromTrialDate: '2100-12-01T00:00:00.000Z',
        },
        {
          disposition: 'things happen',
          docketNumber: '999-99',
          removedFromTrial: true,
          removedFromTrialDate: '2100-12-01T00:00:00.000Z',
        },
      ],
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      startDate: PAST_DATE,
    };

    await closeTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: mockTrialSession.trialSessionId,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate.sessionStatus,
    ).toBe('Closed');
  });
});
