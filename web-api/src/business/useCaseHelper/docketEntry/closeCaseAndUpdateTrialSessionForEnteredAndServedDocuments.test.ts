import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import {
  CASE_DISMISSAL_ORDER_TYPES,
  CASE_STATUS_TYPES,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { ENTERED_AND_SERVED_EVENT_CODES } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments } from './closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { deleteCaseDeadline as deleteCaseDeadlineMock } from '@web-api/persistence/postgres/caseDeadlines/deleteCaseDeadline';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { updateTrialSession as updateTrialSessionMock } from '@web-api/persistence/postgres/trialSessions/updateTrialSession';
import { upsertCaseDeadlines as upsertCaseDeadlinesMock } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import { getCaseDeadlinesByConsolidatedCaseDeadlineIds as getCaseDeadlinesByConsolidatedCaseDeadlineIdsMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineIds';

describe('closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments', () => {
  let mockCaseEntity;
  const eventCode = ENTERED_AND_SERVED_EVENT_CODES[4];

  jest.spyOn(Case.prototype, 'setCaseStatus');
  jest.spyOn(TrialSession.prototype, 'removeCaseFromCalendar');
  jest.spyOn(TrialSession.prototype, 'deleteCaseFromCalendar');
  jest.spyOn(TrialSession.prototype, 'validate');
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const updateTrialSession = jest.mocked(updateTrialSessionMock);

  const deleteCaseDeadline = jest.mocked(deleteCaseDeadlineMock);
  const getCaseDeadlinesByDocketNumber = jest.mocked(
    getCaseDeadlinesByDocketNumberMock,
  );
  const upsertCaseDeadlines = jest.mocked(upsertCaseDeadlinesMock);
  const getCaseDeadlinesByConsolidatedCaseDeadlineIds = jest.mocked(
    getCaseDeadlinesByConsolidatedCaseDeadlineIdsMock,
  );

  beforeEach(() => {
    mockCaseEntity = new Case(MOCK_CASE, {
      authorizedUser: mockDocketClerkUser,
    });
    upsertCaseDeadlines.mockImplementation(deadlines => deadlines as any);
    getCaseDeadlinesByConsolidatedCaseDeadlineIds.mockResolvedValue([]);
  });

  CASE_DISMISSAL_ORDER_TYPES.forEach(orderEventCode => {
    it(`should close the case with status type ${CASE_STATUS_TYPES.closedDismissed} when the document being filed is an ${orderEventCode}`, async () => {
      await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity: mockCaseEntity,
        eventCode: orderEventCode,
      });

      expect(Case.prototype.setCaseStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          updatedCaseStatus: CASE_STATUS_TYPES.closedDismissed,
        }),
      );
    });
  });

  it(`should close the case with status type ${CASE_STATUS_TYPES.closed} when the document being filed is NOT one of ${CASE_DISMISSAL_ORDER_TYPES}`, async () => {
    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity: mockCaseEntity,
      eventCode,
    });

    expect(Case.prototype.setCaseStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        updatedCaseStatus: CASE_STATUS_TYPES.closed,
      }),
    );
  });

  it('should return early when the case is NOT assigned to a trial session', async () => {
    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity: new Case(
        { ...MOCK_CASE, trialSessionId: undefined },
        { authorizedUser: mockDocketClerkUser },
      ),
      eventCode,
    });

    expect(getTrialSessionById).not.toHaveBeenCalled();
    expect(updateTrialSession).not.toHaveBeenCalled();
  });

  it('should remove the case from the calendar when the trialSession it`s scheduled on is already calendared', async () => {
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
    });

    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity: new Case(
        { ...MOCK_CASE, trialSessionId: MOCK_TRIAL_REGULAR.trialSessionId },
        { authorizedUser: mockDocketClerkUser },
      ),
      eventCode,
    });

    expect(TrialSession.prototype.removeCaseFromCalendar).toHaveBeenCalledWith({
      disposition: 'Status was changed to Closed',
      docketNumber: mockCaseEntity.docketNumber,
    });
  });

  it('should delete the case from the calendar when the trialSession it`s scheduled on is NOT already calendared', async () => {
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_REGULAR,
      isCalendared: false,
    });

    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity: new Case(
        { ...MOCK_CASE, trialSessionId: MOCK_TRIAL_REGULAR.trialSessionId },
        { authorizedUser: mockDocketClerkUser },
      ),
      eventCode,
    });

    expect(TrialSession.prototype.deleteCaseFromCalendar).toHaveBeenCalledWith({
      docketNumber: mockCaseEntity.docketNumber,
    });
  });

  it('should not persist the trial session changes when it`s not valid', async () => {
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
      // @ts-expect-error - This is intentionally breaking the type to test null handling for required field
      proceedingType: null, // Required on TrialSession entity
    });

    await expect(
      closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity: new Case(
          { ...MOCK_CASE, trialSessionId: MOCK_TRIAL_REGULAR.trialSessionId },
          { authorizedUser: mockDocketClerkUser },
        ),
        eventCode,
      }),
    ).rejects.toThrow();

    expect(updateTrialSession).not.toHaveBeenCalled();
  });

  it('should make a call to persist the changes to the trial session when isCalendared is true', async () => {
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
    });

    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity: new Case(
        { ...MOCK_CASE, trialSessionId: MOCK_TRIAL_REGULAR.trialSessionId },
        { authorizedUser: mockDocketClerkUser },
      ),
      eventCode,
    });

    expect(updateTrialSession).toHaveBeenCalled();
  });

  it('should delete any case deadlines and automatic block information', async () => {
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
    });

    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      { caseDeadlineId: '123' } as any,
    ]);
    deleteCaseDeadline.mockResolvedValue({} as any);

    mockCaseEntity = new Case(
      {
        ...MOCK_CASE,
        docketEntries: MOCK_DOCUMENTS[0],
        automaticBlocked: true,
        automaticBlockedReason: 'something, something',
        automaticBlockedDate: 'yesterday',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity: mockCaseEntity,
      eventCode,
    });

    expect(deleteCaseDeadline).toHaveBeenCalledWith({
      caseDeadlineId: '123',
    });

    expect(mockCaseEntity.automaticBlocked).toEqual(false);
    expect(mockCaseEntity.automaticBlockedReason).toBeUndefined();
    expect(mockCaseEntity.automaticBlockedDate).toBeUndefined();
  });

  it('should delete any case deadlines, unlink child case deadlines and automatic block information when closing a lead case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...MOCK_TRIAL_REGULAR,
        isCalendared: true,
      });

    const LEAD_CASE_DEADLINE_ID = 'LEAD_CASE_DEADLINE_ID';
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      { caseDeadlineId: LEAD_CASE_DEADLINE_ID } as any,
    ]);

    const CHILD_CASE_DEADLINE_ID = 'CHILD_CASE_DEADLINE_ID';
    getCaseDeadlinesByConsolidatedCaseDeadlineIds.mockResolvedValue([
      {
        caseDeadlineId: CHILD_CASE_DEADLINE_ID,
        consolidatedCaseDeadlineId: 'TEST_CONSOLIDATED_CASE_DEADLINE_ID',
      } as any,
    ]);

    deleteCaseDeadline.mockResolvedValue({} as any);

    mockCaseEntity = new Case(
      {
        ...MOCK_CASE,
        leadDocketNumber: MOCK_CASE.docketNumber,
        docketEntries: MOCK_DOCUMENTS[0],
        automaticBlocked: true,
        automaticBlockedReason: 'something, something',
        automaticBlockedDate: 'yesterday',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity: mockCaseEntity,
      eventCode,
    });

    const deleteCaseDeadlineCalls = deleteCaseDeadline.mock.calls;
    expect(deleteCaseDeadlineCalls.length).toEqual(1);
    expect(deleteCaseDeadlineCalls[0][0]).toEqual({
      caseDeadlineId: LEAD_CASE_DEADLINE_ID,
    });

    const upsertCaseDeadlinesCalls = upsertCaseDeadlines.mock.calls;
    expect(upsertCaseDeadlinesCalls.length).toEqual(1);
    expect(upsertCaseDeadlinesCalls[0][0]).toEqual([
      {
        caseDeadlineId: CHILD_CASE_DEADLINE_ID,
        consolidatedCaseDeadlineId: undefined,
      },
    ]);

    expect(mockCaseEntity.automaticBlocked).toEqual(false);
    expect(mockCaseEntity.automaticBlockedReason).toBeUndefined();
    expect(mockCaseEntity.automaticBlockedDate).toBeUndefined();
  });

  it('should not call "getCaseDeadlinesByConsolidatedCaseDeadlineIds" if there are no lead deadlines', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...MOCK_TRIAL_REGULAR,
        isCalendared: true,
      });

    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);

    const CHILD_CASE_DEADLINE_ID = 'CHILD_CASE_DEADLINE_ID';
    getCaseDeadlinesByConsolidatedCaseDeadlineIds.mockResolvedValue([
      {
        caseDeadlineId: CHILD_CASE_DEADLINE_ID,
        consolidatedCaseDeadlineId: 'TEST_CONSOLIDATED_CASE_DEADLINE_ID',
      } as any,
    ]);

    mockCaseEntity = new Case(
      {
        ...MOCK_CASE,
        leadDocketNumber: MOCK_CASE.docketNumber,
        docketEntries: MOCK_DOCUMENTS[0],
        automaticBlocked: true,
        automaticBlockedReason: 'something, something',
        automaticBlockedDate: 'yesterday',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity: mockCaseEntity,
      eventCode,
    });

    const getCaseDeadlinesByConsolidatedCaseDeadlineIdsCalls =
      getCaseDeadlinesByConsolidatedCaseDeadlineIds.mock.calls;
    expect(getCaseDeadlinesByConsolidatedCaseDeadlineIdsCalls.length).toEqual(
      0,
    );
  });
});
