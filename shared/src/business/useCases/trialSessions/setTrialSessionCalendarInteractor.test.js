const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  PARTY_TYPES,
  ROLES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  setTrialSessionCalendarInteractor,
} = require('./setTrialSessionCalendarInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { User } = require('../../entities/User');

describe('setTrialSessionCalendarInteractor', () => {
  let user;
  const MOCK_TRIAL = {
    chambersPhoneNumber: '1111111',
    joinPhoneNumber: '0987654321',
    judge: {
      name: 'Sarah Jane',
      userId: '822366b7-e47c-413e-811f-d29113d09b06',
    },
    maxCases: 100,
    meetingId: '1234567890',
    password: 'abcdefg',
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    sessionType: 'Regular',
    startDate: '2025-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
  };
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });

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
      setTrialSessionCalendarInteractor(applicationContext, {
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

    await setTrialSessionCalendarInteractor(applicationContext, {
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

    await setTrialSessionCalendarInteractor(applicationContext, {
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

    await setTrialSessionCalendarInteractor(applicationContext, {
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

  it('should call getEligibleCasesForTrialSession with correct limit when no cases have been manually added and QCed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([]);

    await setTrialSessionCalendarInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getPersistenceGateway().getEligibleCasesForTrialSession
        .mock.calls[0][0],
    ).toMatchObject({
      limit: 150, // max cases + buffer
    });
  });

  it('should call getEligibleCasesForTrialSession with correct limit when 1 case has been manually added and QCed', async () => {
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

    await setTrialSessionCalendarInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getPersistenceGateway().getEligibleCasesForTrialSession
        .mock.calls[0][0],
    ).toMatchObject({
      limit: 149, // max cases + buffer - manually added case
    });
  });
});
