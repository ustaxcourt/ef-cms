const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  deleteTrialSessionInteractor,
} = require('./deleteTrialSessionInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

describe('deleteTrialSessionInteractor', () => {
  const MOCK_TRIAL = {
    caseOrder: [{ docketNumber: MOCK_CASE.docketNumber }],
    isCalendared: false,
    judge: {
      name: 'Judge Yggdrasil',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    },
    maxCases: 100,
    sessionType: 'Regular',
    startDate: '2001-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
    trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  let user;
  let mockTrialSession;

  beforeEach(() => {
    mockTrialSession = MOCK_TRIAL;

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
      deleteTrialSessionInteractor(applicationContext, {
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
      deleteTrialSessionInteractor(applicationContext, {
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
      ...MOCK_TRIAL,
    };

    await expect(
      deleteTrialSessionInteractor(applicationContext, {
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Trial session cannot be updated after its start date');
  });

  it('throws error if trial session is calendared', async () => {
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    mockTrialSession = {
      ...MOCK_TRIAL,
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
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    mockTrialSession = {
      ...MOCK_TRIAL,
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
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteTrialSession,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });

  it('should not call createCaseTrialSortMappingRecords if the case has no trial city', async () => {
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    mockTrialSession = {
      ...MOCK_TRIAL,
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
    ).not.toBeCalled();
  });
});
