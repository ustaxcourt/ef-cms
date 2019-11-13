const {
  updateCaseContextInteractor,
} = require('./updateCaseContextInteractor');
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

const MOCK_TRIAL_SESSION = {
  caseOrder: [
    { caseId: MOCK_CASE.caseId },
    { caseId: 'fa1179bd-04f5-4934-a716-964d8d7babc6' },
  ],
  isCalendared: true,
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '3000',
  trialLocation: 'Birmingham, AL',
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
};

describe('updateCaseContextInteractor', () => {
  let applicationContext;

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsClerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          updateCase: caseToUpdate => Promise.resolve(caseToUpdate),
        };
      },
    };
    let error;
    try {
      await updateCaseContextInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        caseStatus: Case.STATUS_TYPES.cav,
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized for update case');
  });

  it('should call updateCase with the updated case status and return the updated case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.docketClerk,
          userId: 'docketClerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          updateCase: ({ caseToUpdate }) => Promise.resolve(caseToUpdate),
        };
      },
    };
    const result = await updateCaseContextInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      caseStatus: Case.STATUS_TYPES.cav,
    });
    expect(result.status).toEqual(Case.STATUS_TYPES.cav);
  });

  it('should call updateCase and remove the case from trial if the old case status was calendared and the new case status is CAV', async () => {
    const getTrialSessionByIdStub = jest.fn(async () => {
      return MOCK_TRIAL_SESSION;
    });
    const updateTrialSessionStub = jest.fn(async updatedTrialSession => {
      return updatedTrialSession;
    });
    const getCaseByCaseIdStub = jest.fn().mockReturnValue({
      ...MOCK_CASE,
      associatedJudge: 'Judge Bob',
      status: Case.STATUS_TYPES.calendared,
      trialSessionId: '83ed63e7-0583-4ecf-882d-d6d6069637ff',
    });

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.docketClerk,
          userId: 'docketClerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          createCaseTrialSortMappingRecords: () => {},
          getCaseByCaseId: getCaseByCaseIdStub,
          getTrialSessionById: getTrialSessionByIdStub,
          updateCase: ({ caseToUpdate }) => Promise.resolve(caseToUpdate),
          updateTrialSession: updateTrialSessionStub,
        };
      },
    };
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
    const getTrialSessionByIdStub = jest.fn(async () => {
      return MOCK_TRIAL_SESSION;
    });
    const updateTrialSessionStub = jest.fn(async updatedTrialSession => {
      return updatedTrialSession;
    });
    const getCaseByCaseIdStub = jest.fn().mockReturnValue({
      ...MOCK_CASE,
      associatedJudge: 'Judge Rachael',
      status: Case.STATUS_TYPES.calendared,
      trialSessionId: '83ed63e7-0583-4ecf-882d-d6d6069637ff',
    });

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.docketClerk,
          userId: 'docketClerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          createCaseTrialSortMappingRecords: () => {},
          getCaseByCaseId: getCaseByCaseIdStub,
          getTrialSessionById: getTrialSessionByIdStub,
          updateCase: ({ caseToUpdate }) => Promise.resolve(caseToUpdate),
          updateTrialSession: updateTrialSessionStub,
        };
      },
    };
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
    const getCaseByCaseIdStub = jest.fn().mockReturnValue({
      ...MOCK_CASE,
      status: Case.STATUS_TYPES.generalDocketReadyForTrial,
    });
    const deleteCaseTrialSortMappingRecordsStub = jest.fn();

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.docketClerk,
          userId: 'docketClerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          deleteCaseTrialSortMappingRecords: deleteCaseTrialSortMappingRecordsStub,
          getCaseByCaseId: getCaseByCaseIdStub,
          updateCase: ({ caseToUpdate }) => Promise.resolve(caseToUpdate),
        };
      },
    };
    const result = await updateCaseContextInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      caseStatus: Case.STATUS_TYPES.generalDocket,
    });
    expect(result.status).toEqual(Case.STATUS_TYPES.generalDocket);
    expect(deleteCaseTrialSortMappingRecordsStub).toHaveBeenCalled();
  });

  it('should call updateCase and createCaseTrialSortMappingRecords if the case status is being updated to Ready for Trial', async () => {
    const getCaseByCaseIdStub = jest.fn().mockReturnValue({
      ...MOCK_CASE,
      status: Case.STATUS_TYPES.generalDocket,
    });
    const createCaseTrialSortMappingRecordsStub = jest.fn();

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.docketClerk,
          userId: 'docketClerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          createCaseTrialSortMappingRecords: createCaseTrialSortMappingRecordsStub,
          getCaseByCaseId: getCaseByCaseIdStub,
          updateCase: ({ caseToUpdate }) => Promise.resolve(caseToUpdate),
        };
      },
    };
    const result = await updateCaseContextInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      caseStatus: Case.STATUS_TYPES.generalDocketReadyForTrial,
    });
    expect(result.status).toEqual(Case.STATUS_TYPES.generalDocketReadyForTrial);
    expect(createCaseTrialSortMappingRecordsStub).toHaveBeenCalled();
  });

  it('should only update the associated judge without changing the status if only the associated judge is passed in', async () => {
    const getCaseByCaseIdStub = jest.fn().mockReturnValue({
      ...MOCK_CASE,
      associatedJudge: 'Judge Buch',
      status: Case.STATUS_TYPES.submitted,
    });

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.docketClerk,
          userId: 'docketClerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: getCaseByCaseIdStub,
          updateCase: ({ caseToUpdate }) => Promise.resolve(caseToUpdate),
        };
      },
    };
    const result = await updateCaseContextInteractor({
      applicationContext,
      associatedJudge: 'Judge Carluzzo',
      caseId: MOCK_CASE.caseId,
    });
    expect(result.status).toEqual(Case.STATUS_TYPES.submitted);
    expect(result.associatedJudge).toEqual('Judge Carluzzo');
  });

  it('should only update the associated judge without changing the status if the associated judge and the same case status are passed in', async () => {
    const getCaseByCaseIdStub = jest.fn().mockReturnValue({
      ...MOCK_CASE,
      associatedJudge: 'Judge Buch',
      status: Case.STATUS_TYPES.submitted,
    });

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.docketClerk,
          userId: 'docketClerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: getCaseByCaseIdStub,
          updateCase: ({ caseToUpdate }) => Promise.resolve(caseToUpdate),
        };
      },
    };
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
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.docketClerk,
          userId: 'docketClerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          updateCase: ({ caseToUpdate }) => Promise.resolve(caseToUpdate),
        };
      },
    };
    const result = await updateCaseContextInteractor({
      applicationContext,
      caseCaption: 'The new case caption',
      caseId: MOCK_CASE.caseId,
    });
    expect(result.caseCaption).toEqual('The new case caption');
  });
});
