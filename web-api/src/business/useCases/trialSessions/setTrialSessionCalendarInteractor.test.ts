import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import '@web-api/persistence/postgres/trialSessions/mocks.jest';
jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/trialSessionCalendarInteractorUtils.ts',
);
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
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
import { getEligibleCasesForTrialSession as getEligibleCasesForTrialSessionMock } from '@web-api/persistence/postgres/cases/getEligibleCasesForTrialSession';
import { upsertCases as upsertCasesMock } from '@web-api/persistence/postgres/cases/upsertCases';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import {
  getCalendaredCasesForTrialSession as getCalendaredCasesForTrialSessionMock,
  RawCaseAndCaseOrder,
} from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { updateTrialSession as updateTrialSessionMock } from '@web-api/persistence/postgres/trialSessions/updateTrialSession';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';

describe('setTrialSessionCalendarInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const getEligibleCasesForTrialSession = jest.mocked(
    getEligibleCasesForTrialSessionMock,
  );
  const upsertCases = jest.mocked(upsertCasesMock);
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);
  const getCalendaredCasesForTrialSession = jest.mocked(
    getCalendaredCasesForTrialSessionMock,
  );
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const updateTrialSession = jest.mocked(updateTrialSessionMock);
  const MOCK_TRIAL: RawTrialSession = {
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
    trialSessionId: '',
    isCalendared: false,
    caseOrder: [
      {
        docketNumber: '102-19',
        addedToSessionAt: '',
        isManuallyAdded: true,
        removedFromTrial: false,
        isHearing: false,
      },
    ],
    hasNottBeenServed: false,
    sessionScope: 'Location-based',
    sessionStatus: '',
    paperServicePdfs: [],
  };

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
  });

  beforeEach(() => {
    getTrialSessionById.mockResolvedValue(MOCK_TRIAL);
    updateCaseAndAssociations.mockResolvedValue({} as RawCase);
  });

  it('throws an exception when there is a permissions issue', async () => {
    getEligibleCasesForTrialSession.mockResolvedValue([MOCK_CASE]);

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

  it('should send an error notification when the trial session is not found', async () => {
    getTrialSessionById.mockResolvedValueOnce(null);

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
    ).toEqual('set_trial_session_calendar_error');
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.message,
    ).toContain('Trial session 6805d1ab-18d0-43ec-bafb-654e83405416 was not found.');
  });

  it('should set a trial session to "calendared" and calendar all cases that have been QCed', async () => {
    getCalendaredCasesForTrialSession.mockResolvedValue([
      {
        ...MOCK_CASE,
        docketNumber: '102-19',
        qcCompleteForTrial: {
          '6805d1ab-18d0-43ec-bafb-654e83405416': true,
        },
      },
    ] as unknown as RawCaseAndCaseOrder[]);
    getEligibleCasesForTrialSession.mockResolvedValue([
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
      updateTrialSession.mock.calls[0][0].trialSessionToUpdate.isCalendared,
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
    getCalendaredCasesForTrialSession.mockResolvedValue([
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
    ] as unknown as RawCaseAndCaseOrder[]);
    getEligibleCasesForTrialSession.mockResolvedValue([
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
      updateTrialSession.mock.calls[0][0].trialSessionToUpdate.isCalendared,
    ).toEqual(true);
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
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
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.action,
    ).toEqual('set_trial_session_calendar_error');
    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    getCalendaredCasesForTrialSession.mockResolvedValueOnce([]);
    getEligibleCasesForTrialSession.mockResolvedValueOnce([
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

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });

  it('should sort eligible cases in the correct priority order (highPriority, docketNumberSuffix) before calendaring them', async () => {
    const hpSuffixDocketNumber = '101-20';
    const regularDocketNumber1 = '103-20';
    const regularDocketNumber2 = '104-20';

    getCalendaredCasesForTrialSession.mockResolvedValue([]);

    getEligibleCasesForTrialSession.mockResolvedValue([
      {
        ...MOCK_CASE,
        docketNumber: hpSuffixDocketNumber,
        docketNumberSuffix: HIGH_PRIORITY_SUFFIXES[0],
        qcCompleteForTrial: {
          '6805d1ab-18d0-43ec-bafb-654e83405416': true,
        },
      },
      {
        ...MOCK_CASE,
        docketNumber: regularDocketNumber1,
        docketNumberSuffix: 'NotHighPriority',
        qcCompleteForTrial: {
          '6805d1ab-18d0-43ec-bafb-654e83405416': true,
        },
      },
      {
        ...MOCK_CASE,
        docketNumber: regularDocketNumber2,
        docketNumberSuffix: 'AlsoNotHighPriority',
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
      hpSuffixDocketNumber,
      regularDocketNumber1,
      regularDocketNumber2,
    ]);
  });
});
