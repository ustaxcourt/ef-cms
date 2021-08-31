const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  deleteTrialSessionInteractor,
} = require('./deleteTrialSessionInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_TRIAL_REGULAR } = require('../../../test/mockTrial');
const { ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

describe('deleteTrialSessionInteractor', () => {
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
      ...MOCK_TRIAL_REGULAR,
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
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

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

  it('does not delete the trial session working copy if there is no judge on the trial session', async () => {
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

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
    ).not.toBeCalled();
  });

  it('should not call createCaseTrialSortMappingRecords if the case has no trial city', async () => {
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

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
    ).not.toBeCalled();
  });
});
