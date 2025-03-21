import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import {
  CASE_DISMISSAL_ORDER_TYPES,
  CASE_STATUS_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { ENTERED_AND_SERVED_EVENT_CODES } from '../../../../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '../../../../../shared/src/test/mockTrial';
import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments } from './closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { deleteCaseDeadline as deleteCaseDeadlineMock } from '@web-api/persistence/postgres/caseDeadlines/deleteCaseDeadline';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';

describe('closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments', () => {
  let mockCaseEntity;
  const eventCode = ENTERED_AND_SERVED_EVENT_CODES[4];

  jest.spyOn(Case.prototype, 'setCaseStatus');
  jest.spyOn(TrialSession.prototype, 'removeCaseFromCalendar');
  jest.spyOn(TrialSession.prototype, 'deleteCaseFromCalendar');
  jest.spyOn(TrialSession.prototype, 'validate');

  const deleteCaseDeadline = jest.mocked(deleteCaseDeadlineMock);
  const getCaseDeadlinesByDocketNumber = jest.mocked(
    getCaseDeadlinesByDocketNumberMock,
  );

  beforeEach(() => {
    mockCaseEntity = new Case(MOCK_CASE, {
      authorizedUser: mockDocketClerkUser,
    });
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

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).not.toHaveBeenCalled();
  });

  it('should remove the case from the calendar when the trialSession it`s scheduled on is already calendared', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
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
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
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
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...MOCK_TRIAL_REGULAR,
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

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).not.toHaveBeenCalled();
  });

  it('should make a call to persist the changes to the trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
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

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('should delete any case deadlines and automatic block information', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
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
});
