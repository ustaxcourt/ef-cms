const {
  updateCaseContextInteractor,
} = require('./updateCaseContextInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

describe('updateCaseContextInteractor', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.docketClerk,
      userId: 'docketClerk',
    });
  });

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(Promise.resolve(MOCK_CASE));
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateCaseContextInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        caseStatus: Case.STATUS_TYPES.cav,
      }),
    ).rejects.toThrow('Unauthorized for update case');
  });

  it('should call updateCase with the updated case status and return the updated case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.docketClerk,
      userId: 'docketClerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(Promise.resolve(MOCK_CASE));

    const result = await updateCaseContextInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      caseStatus: Case.STATUS_TYPES.cav,
    });
    expect(result.status).toEqual(Case.STATUS_TYPES.cav);
  });

  it('should call updateCase and remove the case from trial if the old case status was calendared and the new case status is CAV', async () => {
    const result = await updateCaseContextInteractor({
      applicationContext,
      associatedJudge: 'Judge Rachael',
      caseId: MOCK_CASE.caseId,
      caseStatus: Case.STATUS_TYPES.cav,
    });

    expect(result.status).toEqual(Case.STATUS_TYPES.cav);
    expect(result.associatedJudge).toEqual('Judge Rachael');
    expect(result.trialSessionId).toBeUndefined();
  });

  it('should call updateCase and remove the case from trial if the old case status was calendared and the new case status is General Docket - Not At Issue', async () => {
    const result = await updateCaseContextInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      caseStatus: Case.STATUS_TYPES.generalDocket,
    });

    expect(result.status).toEqual(Case.STATUS_TYPES.generalDocket);
    expect(result.associatedJudge).toEqual(Case.CHIEF_JUDGE);
    expect(result.trialSessionId).toBeUndefined();
  });

  it('should call updateCase and deleteCaseTrialSortMappingRecords if the old case status was Ready for Trial and the new status is different', async () => {
    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue({
      ...MOCK_CASE,
      status: Case.STATUS_TYPES.generalDocketReadyForTrial,
    });

    const result = await updateCaseContextInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      caseStatus: Case.STATUS_TYPES.generalDocket,
    });

    expect(result.status).toEqual(Case.STATUS_TYPES.generalDocket);
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('should call updateCase and createCaseTrialSortMappingRecords if the case status is being updated to Ready for Trial', async () => {
    const result = await updateCaseContextInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      caseStatus: Case.STATUS_TYPES.generalDocketReadyForTrial,
    });

    expect(result.status).toEqual(Case.STATUS_TYPES.generalDocketReadyForTrial);
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('should only update the associated judge without changing the status if only the associated judge is passed in', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.docketClerk,
      userId: 'docketClerk',
    });
    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue({
      ...MOCK_CASE,
      associatedJudge: 'Judge Buch',
      status: Case.STATUS_TYPES.submitted,
    });

    const result = await updateCaseContextInteractor({
      applicationContext,
      associatedJudge: 'Judge Carluzzo',
      caseId: MOCK_CASE.caseId,
    });
    expect(result.status).toEqual(Case.STATUS_TYPES.submitted);
    expect(result.associatedJudge).toEqual('Judge Carluzzo');
  });

  it('should only update the associated judge without changing the status if the associated judge and the same case status are passed in', async () => {
    const result = await updateCaseContextInteractor({
      applicationContext,
      associatedJudge: 'Judge Carluzzo',
      caseId: MOCK_CASE.caseId,
      caseStatus: Case.STATUS_TYPES.submitted,
    });

    expect(result.status).toEqual(Case.STATUS_TYPES.submitted);
    expect(result.associatedJudge).toEqual('Judge Carluzzo');
  });

  it('should call updateCase with the updated case caption and return the updated case', async () => {
    const result = await updateCaseContextInteractor({
      applicationContext,
      caseCaption: 'The new case caption',
      caseId: MOCK_CASE.caseId,
    });

    expect(result.caseCaption).toEqual('The new case caption');
  });
});
