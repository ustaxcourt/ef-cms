const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  closeTrialSessionInteractor,
} = require('./closeTrialSessionInteractor');
const {
  ROLES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_TRIAL_REGULAR } = require('../../../test/mockTrial');
const { User } = require('../../entities/User');

describe('closeTrialSessionInteractor', () => {
  let user;
  let mockTrialSession;

  beforeEach(() => {
    mockTrialSession = MOCK_TRIAL_REGULAR;

    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => user);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => mockTrialSession);
  });

  it('throws error if user is unauthorized', async () => {
    user = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      closeTrialSessionInteractor(applicationContext, {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('throws an exception when it fails to find a trial session', async () => {
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    mockTrialSession = null;

    await expect(
      closeTrialSessionInteractor(applicationContext, {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('trial session not found');
  });

  it('throws error when trial session start date is in the past', async () => {
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
    };

    await expect(
      closeTrialSessionInteractor(applicationContext, {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow(
      'Trial session cannot be closed until after its start date',
    );
  });

  it('throws an error when there are active cases on the trial session', async () => {
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      caseOrder: [
        { docketNumber: MOCK_CASE.docketNumber, removedFromTrial: false },
      ],
      startDate: '2025-03-01T00:00:00.000Z',
    };

    await expect(
      closeTrialSessionInteractor(applicationContext, {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Trial session cannot be closed with open cases');
  });

  it('does not throw an error when there are no cases on the trial session', async () => {
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      caseOrder: undefined,
      startDate: '2025-03-01T00:00:00.000Z',
    };

    await expect(
      closeTrialSessionInteractor(applicationContext, {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.not.toThrow('Trial session cannot be closed with open cases');
  });

  it('should not close the trial session and throws an error instead', async () => {
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      caseOrder: [
        { docketNumber: MOCK_CASE.docketNumber, removedFromTrial: true },
        { docketNumber: MOCK_CASE.docketNumber, removedFromTrial: false },
      ],
      startDate: '2100-12-01T00:00:00.000Z',
    };

    await expect(
      closeTrialSessionInteractor(applicationContext, {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Trial session cannot be closed with open cases');
  });

  it('closes the trial session and invokes expected persistence methods', async () => {
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

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
      startDate: '2100-12-01T00:00:00.000Z',
    };

    await closeTrialSessionInteractor(applicationContext, {
      trialSessionId: mockTrialSession.trialSessionId,
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate.isClosed,
    ).toBe(true);
  });
});
