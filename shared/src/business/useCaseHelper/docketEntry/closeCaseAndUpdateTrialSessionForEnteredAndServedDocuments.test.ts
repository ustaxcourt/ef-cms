import {
  CASE_DISMISSAL_ORDER_TYPES,
  CASE_STATUS_TYPES,
} from '../../entities/EntityConstants';
import { Case } from '../../entities/cases/Case';
import { ENTERED_AND_SERVED_EVENT_CODES } from '../../entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';
import { closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments } from './closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments';

describe('closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments', () => {
  let mockCaseEntity;
  const eventCode = ENTERED_AND_SERVED_EVENT_CODES[4];

  jest.spyOn(Case.prototype, 'setCaseStatus');
  jest.spyOn(TrialSession.prototype, 'removeCaseFromCalendar');
  jest.spyOn(TrialSession.prototype, 'deleteCaseFromCalendar');
  jest.spyOn(TrialSession.prototype, 'validate');

  beforeEach(() => {
    mockCaseEntity = new Case(MOCK_CASE, {
      applicationContext,
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

  it('should make a call to delete the case trial sort mapping records', async () => {
    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity: mockCaseEntity,
      eventCode,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
    ).toBe(mockCaseEntity.docketNumber);
  });

  it('should return early when the case is NOT assigned to a trial session', async () => {
    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity: new Case(
        { ...MOCK_CASE, trialSessionId: undefined },
        { applicationContext },
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
        { applicationContext },
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
        { applicationContext },
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
          { applicationContext },
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
        { applicationContext },
      ),
      eventCode,
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });
});
