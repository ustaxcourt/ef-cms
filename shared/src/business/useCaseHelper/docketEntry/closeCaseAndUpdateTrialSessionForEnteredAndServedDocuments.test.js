const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments,
} = require('./closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments');
const { Case } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_TRIAL_REGULAR } = require('../../../test/mockTrial');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');

describe('closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments', () => {
  let mockCaseEntity;

  jest.spyOn(Case.prototype, 'closeCase');
  jest.spyOn(TrialSession.prototype, 'removeCaseFromCalendar');
  jest.spyOn(TrialSession.prototype, 'deleteCaseFromCalendar');
  jest.spyOn(TrialSession.prototype, 'validate');

  beforeEach(() => {
    mockCaseEntity = new Case(MOCK_CASE, {
      applicationContext,
    });
  });

  it('should close the case', async () => {
    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity: mockCaseEntity,
    });

    expect(Case.prototype.closeCase).toHaveBeenCalled();
  });

  it('should make a call to delete the case trial sort mapping records', async () => {
    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity: mockCaseEntity,
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
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });
});
