const {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
} = require('../entities/EntityConstants');
const {
  updateCaseContextInteractor,
} = require('./updateCaseContextInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { ROLES } = require('../entities/EntityConstants');

describe('updateCaseContextInteractor', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: '7ad8dcbc-5978-4a29-8c41-02422b66f410',
    });
  });

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(Promise.resolve(MOCK_CASE));
    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockReturnValue(Promise.resolve(MOCK_CASE));
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateCaseContextInteractor(applicationContext, {
        caseStatus: CASE_STATUS_TYPES.cav,
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for update case');
  });

  it('should call updateCase with the updated case status and return the updated case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: '7ad8dcbc-5978-4a29-8c41-02422b66f410',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(Promise.resolve(MOCK_CASE));

    const result = await updateCaseContextInteractor(applicationContext, {
      caseStatus: CASE_STATUS_TYPES.cav,
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(result.status).toEqual(CASE_STATUS_TYPES.cav);
  });

  it('should call updateCase and remove the case from trial if the old case status was calendared and the new case status is CAV', async () => {
    const result = await updateCaseContextInteractor(applicationContext, {
      associatedJudge: 'Judge Rachael',
      caseStatus: CASE_STATUS_TYPES.cav,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result.status).toEqual(CASE_STATUS_TYPES.cav);
    expect(result.associatedJudge).toEqual('Judge Rachael');
    expect(result.trialSessionId).toBeUndefined();
  });

  it('should call updateCase and remove the case from trial if the old case status was calendared and the new case status is General Docket - Not At Issue', async () => {
    const result = await updateCaseContextInteractor(applicationContext, {
      caseStatus: CASE_STATUS_TYPES.generalDocket,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result.status).toEqual(CASE_STATUS_TYPES.generalDocket);
    expect(result.associatedJudge).toEqual(CHIEF_JUDGE);
    expect(result.trialSessionId).toBeUndefined();
  });

  it('should call updateCase and deleteCaseTrialSortMappingRecords if the old case status was Ready for Trial and the new status is different', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      });

    const result = await updateCaseContextInteractor(applicationContext, {
      caseStatus: CASE_STATUS_TYPES.generalDocket,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result.status).toEqual(CASE_STATUS_TYPES.generalDocket);
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('should call updateCase and createCaseTrialSortMappingRecords if the case status is being updated to Ready for Trial and is not assigned to a trial session', async () => {
    const result = await updateCaseContextInteractor(applicationContext, {
      caseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result.status).toEqual(CASE_STATUS_TYPES.generalDocketReadyForTrial);
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('should call updateCase but not createCaseTrialSortMappingRecords if the case status is being updated to Ready for Trial and is already assigned to a trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          trialDate: '2019-03-01T21:40:46.415Z',
          trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
      );

    applicationContext.getUseCaseHelpers().updateCaseAndAssociations = jest
      .fn()
      .mockImplementation(({ caseToUpdate }) => {
        return caseToUpdate;
      });

    const result = await updateCaseContextInteractor(applicationContext, {
      caseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result.status).toEqual(CASE_STATUS_TYPES.generalDocketReadyForTrial);
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
  });

  it('should only update the associated judge without changing the status if only the associated judge is passed in', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: '7ad8dcbc-5978-4a29-8c41-02422b66f410',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        associatedJudge: 'Judge Buch',
        status: CASE_STATUS_TYPES.submitted,
      });

    const result = await updateCaseContextInteractor(applicationContext, {
      associatedJudge: 'Judge Carluzzo',
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(result.status).toEqual(CASE_STATUS_TYPES.submitted);
    expect(result.associatedJudge).toEqual('Judge Carluzzo');
  });

  it('should only update the associated judge without changing the status if the associated judge and the same case status are passed in', async () => {
    const result = await updateCaseContextInteractor(applicationContext, {
      associatedJudge: 'Judge Carluzzo',
      caseStatus: CASE_STATUS_TYPES.submitted,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result.status).toEqual(CASE_STATUS_TYPES.submitted);
    expect(result.associatedJudge).toEqual('Judge Carluzzo');
  });

  it('should call updateCase with the updated case caption and return the updated case', async () => {
    const result = await updateCaseContextInteractor(applicationContext, {
      caseCaption: 'The new case caption',
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result.caseCaption).toEqual('The new case caption');
  });

  it('should not call createCaseTrialSortMappingRecords if the case is missing a trial city', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          preferredTrialCity: null,
        }),
      );

    await updateCaseContextInteractor(applicationContext, {
      caseCaption: 'The new case caption',
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toBeCalled();
  });
});
