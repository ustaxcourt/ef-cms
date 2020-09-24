const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  setTrialSessionCalendarInteractor,
} = require('./setTrialSessionCalendarInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { PARTY_TYPES, ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

describe('setTrialSessionCalendarInteractor', () => {
  let user;
  const MOCK_TRIAL = {
    maxCases: 100,
    sessionType: 'Regular',
    startDate: '2025-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
  };

  beforeEach(() => {
    user = new User({
      name: 'petitionsClerk',
      role: ROLES.petitionsClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL);
    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});
    applicationContext
      .getPersistenceGateway()
      .updateTrialSession.mockImplementation(v => v.trialSessionToUpdate);
  });

  it('throws an exception when there is a permissions issue', async () => {
    user = new User({
      name: PARTY_TYPES.petitioner,
      role: ROLES.petitioner,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialSession.mockReturnValue([MOCK_CASE]);

    await expect(
      setTrialSessionCalendarInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should set a trial session to "calendared" and calendar all cases that have been QCed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([
        {
          ...MOCK_CASE,
          docketNumber: '102-19',
          qcCompleteForTrial: {
            '6805d1ab-18d0-43ec-bafb-654e83405416': true,
          },
        },
      ]);
    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialSession.mockReturnValue([
        {
          ...MOCK_CASE,
          qcCompleteForTrial: {
            '6805d1ab-18d0-43ec-bafb-654e83405416': true,
          },
        },
      ]);

    applicationContext
      .getPersistenceGateway()
      .setPriorityOnAllWorkItems.mockReturnValue({});

    await setTrialSessionCalendarInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });

  it('should set a trial session to "calendared" and remove cases from the trial sessionthat have not been QCed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([
        {
          ...MOCK_CASE,
          docketNumber: '102-19',
          qcCompleteForTrial: {
            '6805d1ab-18d0-43ec-bafb-654e83405416': false,
          },
          trialDate: '2020-08-28T01:49:58.121Z',
          trialLocation: 'Birmingham, Alabama',
          trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          trialTime: '11:00',
        },
      ]);
    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialSession.mockReturnValue([
        {
          ...MOCK_CASE,
          qcCompleteForTrial: {
            '6805d1ab-18d0-43ec-bafb-654e83405416': false,
          },
        },
      ]);

    await setTrialSessionCalendarInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      trialDate: undefined,
      trialLocation: undefined,
      trialSessionId: undefined,
      trialTime: undefined,
    });
  });

  it('should set work items as high priority for each case that is calendared', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([
        {
          ...MOCK_CASE,
          docketNumber: '102-19',
          qcCompleteForTrial: {
            '6805d1ab-18d0-43ec-bafb-654e83405416': true,
          },
        },
      ]);
    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialSession.mockReturnValue([
        {
          ...MOCK_CASE,
          qcCompleteForTrial: {
            '6805d1ab-18d0-43ec-bafb-654e83405416': true,
          },
        },
      ]);

    await setTrialSessionCalendarInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems.mock
        .calls.length,
    ).toEqual(2);
    expect(
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems.mock
        .calls[0][0],
    ).toMatchObject({
      highPriority: true,
      trialDate: '2025-12-01T00:00:00.000Z',
    });
    expect(
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems.mock
        .calls[1][0],
    ).toMatchObject({
      highPriority: true,
      trialDate: '2025-12-01T00:00:00.000Z',
    });
  });
});
