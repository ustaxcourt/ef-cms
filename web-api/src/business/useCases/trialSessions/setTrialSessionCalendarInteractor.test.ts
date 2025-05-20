import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock(
  '@web-api/business/useCases/trialSessions/trialSessionCalendarInteractorUtils',
);
jest.mock('@web-api/business/useCaseHelper/acquireLock');
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { acquireLock as acquireLockMock } from '@web-api/business/useCaseHelper/acquireLock';
import { MOCK_CASE } from '@shared/test/mockCase';
import {
  HIGH_PRIORITY_SUFFIXES,
  CASE_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { setTrialSessionCalendarInteractor } from './setTrialSessionCalendarInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getFullEligibleCasesForTrialSession as getFullEligibleCasesForTrialSessionMock } from '@web-api/persistence/postgres/cases/getFullEligibleCasesForTrialSession';
import { removeLock as removeLockMock } from '@web-api/business/useCaseHelper/acquireLock';
import { updateWorkItemsForCasesToCalendar as updateWorkItemsForCasesToCalendarMock } from '@web-api/business/useCases/trialSessions/trialSessionCalendarInteractorUtils';
import { upsertCases as upsertCasesMock } from '@web-api/persistence/postgres/cases/upsertCases';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

const getFullEligibleCasesForTrialSession = jest.mocked(
  getFullEligibleCasesForTrialSessionMock,
);

describe('setTrialSessionCalendarInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const upsertCases = jest.mocked(upsertCasesMock);
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const acquireLock = jest.mocked(acquireLockMock);
  const removeLock = jest.mocked(removeLockMock);
  const updateWorkItemsForCasesToCalendar = jest.mocked(
    updateWorkItemsForCasesToCalendarMock,
  );
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
    sessionType: SESSION_TYPES.regular,
    startDate: '2025-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
  };

  beforeAll(() => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
  });

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(MOCK_TRIAL);
    updateCaseAndAssociations.mockResolvedValue({} as RawCase);
    applicationContext
      .getPersistenceGateway()
      .updateTrialSession.mockImplementation(v => v.trialSessionToUpdate);
  });

  it('throws an exception when there is a permissions issue', async () => {
    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialSession.mockResolvedValue([MOCK_CASE]);

    await setTrialSessionCalendarInteractor(
      applicationContext,
      {
        clientConnectionId: 'hellomom',
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockPetitionerUser,
    );

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.action,
    ).toEqual('set_trial_session_calendar_error');
  });

  it('should set a trial session to "calendared" and calendar all cases that have been QCed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockResolvedValue([
        {
          ...MOCK_CASE,
          docketNumber: '102-19',
          qcCompleteForTrial: {
            '6805d1ab-18d0-43ec-bafb-654e83405416': true,
          },
        },
      ]);
    getFullEligibleCasesForTrialSession.mockResolvedValue([
      {
        ...MOCK_CASE,
        qcCompleteForTrial: {
          '6805d1ab-18d0-43ec-bafb-654e83405416': true,
        },
      },
    ]);

    await setTrialSessionCalendarInteractor(
      applicationContext,
      {
        clientConnectionId: 'hellomom',
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.action,
    ).toEqual('set_trial_session_calendar_complete');
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate.isCalendared,
    ).toEqual(true);
    expect(upsertCases).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: '102-19',
          status: CASE_STATUS_TYPES.calendared,
        }),
        expect.objectContaining({
          docketNumber: MOCK_CASE.docketNumber,
          status: CASE_STATUS_TYPES.calendared,
        }),
      ]),
    );
  });

  it('should set a trial session to "calendared" and remove cases from the trial session that have not been QCed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockResolvedValue([
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
    getFullEligibleCasesForTrialSession.mockResolvedValue([
      {
        ...MOCK_CASE,
        qcCompleteForTrial: {
          '6805d1ab-18d0-43ec-bafb-654e83405416': false,
        },
      },
    ]);

    await setTrialSessionCalendarInteractor(
      applicationContext,
      {
        clientConnectionId: 'hi',
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockPetitionsClerkUser,
    );

    expect(upsertCases.mock.calls[0][0][0]).toMatchObject({
      docketNumber: '102-19',
      trialDate: undefined,
      trialLocation: undefined,
      trialSessionId: undefined,
      trialTime: undefined,
    });
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate.isCalendared,
    ).toEqual(true);
  });

  it('should set work items as high priority for each case that is calendared', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockResolvedValue([
        {
          ...MOCK_CASE,
          docketNumber: '102-19',
          qcCompleteForTrial: {
            '6805d1ab-18d0-43ec-bafb-654e83405416': true,
          },
        },
        {
          ...MOCK_CASE,
          docketNumber: '103-19',
          qcCompleteForTrial: {
            '6805d1ab-18d0-43ec-bafb-654e83405416': false,
          },
        },
      ]);
    getFullEligibleCasesForTrialSession.mockResolvedValue([
      {
        ...MOCK_CASE,
        qcCompleteForTrial: {
          '6805d1ab-18d0-43ec-bafb-654e83405416': true,
        },
      },
    ]);

    await setTrialSessionCalendarInteractor(
      applicationContext,
      {
        clientConnectionId: 'hi',
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockPetitionsClerkUser,
    );

    expect(
      updateWorkItemsForCasesToCalendar.mock.calls[0][0].casesToCalendar.length,
    ).toBe(2);
    expect(
      updateWorkItemsForCasesToCalendar.mock.calls[0][0].casesToCalendar[0]
        .docketNumber,
    ).toBe('102-19');
    expect(
      updateWorkItemsForCasesToCalendar.mock.calls[0][0].casesToCalendar[1]
        .docketNumber,
    ).toBe(MOCK_CASE.docketNumber);
  });

  it('should call getEligibleCasesForTrialSession with correct limit when no cases have been manually added and QCed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([]);

    await setTrialSessionCalendarInteractor(
      applicationContext,
      {
        clientConnectionId: 'hi',
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockPetitionsClerkUser,
    );

    expect(getFullEligibleCasesForTrialSession.mock.calls[0][0]).toMatchObject({
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

    await setTrialSessionCalendarInteractor(
      applicationContext,
      {
        clientConnectionId: 'hi',
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockPetitionsClerkUser,
    );

    expect(getFullEligibleCasesForTrialSession.mock.calls[0][0]).toMatchObject({
      limit: 149, // max cases + buffer - manually added case
    });
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    acquireLock.mockRejectedValueOnce(new Error('Could not get lock'));

    await setTrialSessionCalendarInteractor(
      applicationContext,
      {
        clientConnectionId: 'hi',
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.action,
    ).toEqual('set_trial_session_calendar_error');
    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockResolvedValueOnce([]);
    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialSession.mockResolvedValueOnce([
        {
          ...MOCK_CASE,
          qcCompleteForTrial: {
            '6805d1ab-18d0-43ec-bafb-654e83405416': true,
          },
        },
      ]);

    await setTrialSessionCalendarInteractor(
      applicationContext,
      {
        clientConnectionId: 'hi',
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockPetitionsClerkUser,
    );

    expect(acquireLock).toHaveBeenCalledWith({
      applicationContext,
      authorizedUser: mockPetitionsClerkUser,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
      ttl: 900,
    });

    expect(removeLock).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });

  it('should sort eligible cases in the correct priority order (highPriority, docketNumberSuffix) before calendaring them', async () => {
    const hpSuffixDocketNumber = '101-20';
    const highPriorityDocketNumber = '103-20';
    const regularDocketNumber = '104-20';

    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([]);

    getFullEligibleCasesForTrialSession.mockResolvedValue([
      {
        ...MOCK_CASE,
        docketNumber: hpSuffixDocketNumber,
        docketNumberSuffix: HIGH_PRIORITY_SUFFIXES[0],
        highPriority: false,
        qcCompleteForTrial: {
          '6805d1ab-18d0-43ec-bafb-654e83405416': true,
        },
      },
      {
        ...MOCK_CASE,
        docketNumber: highPriorityDocketNumber,
        docketNumberSuffix: 'NotHighPriority',
        highPriority: true,
        highPriorityReason: 'When the going gets weird, the weird turn pro',
        qcCompleteForTrial: {
          '6805d1ab-18d0-43ec-bafb-654e83405416': true,
        },
      },
      {
        ...MOCK_CASE,
        docketNumber: regularDocketNumber,
        docketNumberSuffix: 'AlsoNotHighPriority',
        highPriority: false,
        qcCompleteForTrial: {
          '6805d1ab-18d0-43ec-bafb-654e83405416': true,
        },
      },
    ]);

    await setTrialSessionCalendarInteractor(
      applicationContext,
      {
        clientConnectionId: 'hi',
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockPetitionsClerkUser,
    );

    const updatedDocketNumbers = upsertCases.mock.calls[0][0].map(
      c => c.docketNumber,
    );

    expect(updatedDocketNumbers).toEqual([
      highPriorityDocketNumber,
      hpSuffixDocketNumber,
      regularDocketNumber,
    ]);
  });
});
