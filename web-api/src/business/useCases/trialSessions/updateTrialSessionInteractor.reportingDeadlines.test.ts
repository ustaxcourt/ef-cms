jest.mock(
  '@web-api/business/useCases/trialSessions/updateTrialSessionInteractorHelper',
);
jest.mock('@web-api/notifications/sendNotificationToUser');
import '@web-api/persistence/postgres/utils/mocks.jest';
import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import {
  RawTrialSession,
  TCaseOrder,
} from '@shared/business/entities/trialSessions/TrialSession';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { mockCaseServicesSupervisorUser } from '@shared/test/mockAuthUsers';
import { updateCasesAndSetNoticeOfChange } from '@web-api/business/useCases/trialSessions/updateTrialSessionInteractorHelper';
import { updateReportingCalendarDeadlineDates } from '@web-api/persistence/postgres/caseDeadlines/updateReportingCalendarDeadlineDates';
import { updateTrialSession } from '@web-api/business/useCases/trialSessions/updateTrialSessionInteractor';

describe('updateTrialSession: PTMs Due deadlines of a Reporting calendar', () => {
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const dueDate = calculateISODate({ howMuch: 1, units: 'days' });
  const newDueDate = calculateISODate({ howMuch: 5, units: 'days' });
  const caseOrder = [
    { docketNumber: '101-26' },
    { docketNumber: '102-26', isManuallyAdded: true },
    {
      disposition: 'Removed',
      docketNumber: '103-26',
      removedFromTrial: true,
      removedFromTrialDate: '2026-11-01T05:00:00.000Z',
    },
  ] as TCaseOrder[];
  const inPerson: RawTrialSession = {
    ...MOCK_TRIAL_INPERSON,
    caseOrder,
    isCalendared: true,
    startDate: dueDate,
  };
  const reporting: RawTrialSession = {
    ...inPerson,
    address1: undefined,
    city: undefined,
    estimatedEndDate: dueDate,
    postalCode: undefined,
    proceedingType: 'Reporting',
    startTime: undefined,
    state: undefined,
  };

  const updateSession = (
    current: RawTrialSession,
    startDate: string,
  ): Promise<void> => {
    getTrialSessionById.mockResolvedValue(current);
    return updateTrialSession(
      applicationContext,
      {
        clientConnectionId: 'reporting-connection',
        trialSession: {
          ...current,
          estimatedEndDate: current.estimatedEndDate && startDate,
          startDate,
        },
      },
      mockCaseServicesSupervisorUser,
    );
  };

  beforeEach(() => {
    jest.mocked(updateCasesAndSetNoticeOfChange).mockResolvedValue({
      paperServicePdfsCombined: {
        getPageCount: () => 0,
        save: () => undefined,
      },
      sendEmailCalls: [],
      updatedCasesToSave: [],
    } as never);
  });

  it('should move the deadlines of the cases still on a calendared Reporting session to the new due date', async () => {
    await updateSession(reporting, newDueDate);

    expect(updateReportingCalendarDeadlineDates).toHaveBeenCalledWith({
      docketNumbers: ['101-26', '102-26'],
      newDueDate,
      previousDueDate: dueDate,
    });
  });

  it.each([
    ['the due date does not change', reporting, dueDate],
    [
      'the session is not calendared',
      { ...reporting, isCalendared: false },
      newDueDate,
    ],
    ['the session is not Reporting', inPerson, newDueDate],
  ])(
    'should not move deadlines when %s',
    async (_reason, current: RawTrialSession, startDate: string) => {
      await updateSession(current, startDate);

      expect(updateReportingCalendarDeadlineDates).not.toHaveBeenCalled();
    },
  );
});
