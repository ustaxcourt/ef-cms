import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { setPriorityOnAllWorkItems as setPriorityOnAllWorkItemsMock } from '@web-api/persistence/postgres/workitems/setPriorityOnAllWorkItems';
import { setTrialSessionCalendarInteractor } from './setTrialSessionCalendarInteractor';

describe('setTrialSessionCalendarInteractor', () => {
  const setPriorityOnAllWorkItems = setPriorityOnAllWorkItemsMock as jest.Mock;
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
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL);
    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});
    applicationContext
      .getPersistenceGateway()
      .updateTrialSession.mockImplementation(v => v.trialSessionToUpdate);
  });

  it('throws an exception when there is a permissions issue', async () => {
    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialSession.mockReturnValue([MOCK_CASE]);

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
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
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

    await setTrialSessionCalendarInteractor(
      applicationContext,
      {
        clientConnectionId: 'hi',
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockPetitionsClerkUser,
    );

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

    await setTrialSessionCalendarInteractor(
      applicationContext,
      {
        clientConnectionId: 'hi',
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockPetitionsClerkUser,
    );

    expect(setPriorityOnAllWorkItems).toHaveBeenCalled();
    expect(setPriorityOnAllWorkItems.mock.calls.length).toEqual(2);
    expect(setPriorityOnAllWorkItems.mock.calls[0][0]).toMatchObject({
      highPriority: true,
      trialDate: '2025-12-01T00:00:00.000Z',
    });
    expect(setPriorityOnAllWorkItems.mock.calls[1][0]).toMatchObject({
      highPriority: true,
      trialDate: '2025-12-01T00:00:00.000Z',
    });
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

    await setTrialSessionCalendarInteractor(
      applicationContext,
      {
        clientConnectionId: 'hi',
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getEligibleCasesForTrialSession
        .mock.calls[0][0],
    ).toMatchObject({
      limit: 149, // max cases + buffer - manually added case
    });
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

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
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await setTrialSessionCalendarInteractor(
      applicationContext,
      {
        clientConnectionId: 'hi',
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 900,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });
});
