const sinon = require('sinon');
const {
  removeCaseFromTrialInteractor,
} = require('./removeCaseFromTrialInteractor');
const { Case } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { User } = require('../../entities/User');

const MOCK_TRIAL_SESSION = {
  caseOrder: [
    { caseId: MOCK_CASE.caseId },
    { caseId: 'fa1179bd-04f5-4934-a716-964d8d7babc6' },
  ],
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '3000',
  trialLocation: 'Birmingham, AL',
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
};

describe('remove case from trial session', () => {
  let applicationContext;
  const updateTrialSessionStub = sinon.stub().returns();
  const getCaseByCaseIdStub = sinon.stub().returns({
    ...MOCK_CASE,
    associatedJudge: 'someone',
    trialLocation: 'Boise, Idaho',
    trialSessionId: 'abcd',
  });
  const updateCaseStub = sinon.stub().returns();
  const createCaseTrialSortMappingRecordsStub = sinon.stub().returns();

  it('throws error if user is unauthorized', async () => {
    const getTrialSessionByIdStub = sinon.stub().returns(MOCK_TRIAL_SESSION);
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'petitioner',
        };
      },
      getPersistenceGateway: () => {
        return {
          createCaseTrialSortMappingRecords: createCaseTrialSortMappingRecordsStub,
          getCaseByCaseId: getCaseByCaseIdStub,
          getTrialSessionById: getTrialSessionByIdStub,
          updateCase: updateCaseStub,
          updateTrialSession: updateTrialSessionStub,
        };
      },
    };
    await expect(
      removeCaseFromTrialInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        disposition: 'because',
        trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      }),
    ).rejects.toThrow();
  });

  it('calls getTrialSessionById, updateTrialSession, getCaseByCaseId, and updateCase persistence methods with correct parameters for a calendared session', async () => {
    const getTrialSessionByIdStub = sinon
      .stub()
      .returns({ ...MOCK_TRIAL_SESSION, isCalendared: true });

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          createCaseTrialSortMappingRecords: createCaseTrialSortMappingRecordsStub,
          getCaseByCaseId: getCaseByCaseIdStub,
          getTrialSessionById: getTrialSessionByIdStub,
          updateCase: updateCaseStub,
          updateTrialSession: updateTrialSessionStub,
        };
      },
    };

    await removeCaseFromTrialInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      disposition: 'because',
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });

    expect(getTrialSessionByIdStub.called).toEqual(true);
    expect(getTrialSessionByIdStub.getCall(0).args[0].trialSessionId).toEqual(
      MOCK_TRIAL_SESSION.trialSessionId,
    );
    expect(updateTrialSessionStub.called).toEqual(true);
    expect(
      updateTrialSessionStub.getCall(0).args[0].trialSessionToUpdate,
    ).toMatchObject({
      ...MOCK_TRIAL_SESSION,
      caseOrder: [
        {
          caseId: MOCK_CASE.caseId,
          disposition: 'because',
          removedFromTrial: true,
        },
        { caseId: 'fa1179bd-04f5-4934-a716-964d8d7babc6' },
      ],
    });
    expect(getCaseByCaseIdStub.called).toEqual(true);
    expect(getCaseByCaseIdStub.getCall(0).args[0].caseId).toEqual(
      MOCK_CASE.caseId,
    );
    expect(createCaseTrialSortMappingRecordsStub.called).toEqual(true);
    expect(
      createCaseTrialSortMappingRecordsStub.getCall(0).args[0].caseId,
    ).toEqual(MOCK_CASE.caseId);
    expect(updateCaseStub.called).toEqual(true);
    expect(updateCaseStub.getCall(0).args[0].caseToUpdate).toMatchObject({
      associatedJudge: Case.CHIEF_JUDGE,
      caseId: MOCK_CASE.caseId,
      status: Case.STATUS_TYPES.generalDocketReadyForTrial,
      trialLocation: undefined,
      trialSessionId: undefined,
    });
  });

  it('calls getTrialSessionById, updateTrialSession, getCaseByCaseId, and updateCase persistence methods with correct parameters for a not calendared session', async () => {
    const getTrialSessionByIdStub = sinon
      .stub()
      .returns({ ...MOCK_TRIAL_SESSION, isCalendared: false });

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          createCaseTrialSortMappingRecords: createCaseTrialSortMappingRecordsStub,
          getCaseByCaseId: getCaseByCaseIdStub,
          getTrialSessionById: getTrialSessionByIdStub,
          updateCase: updateCaseStub,
          updateTrialSession: updateTrialSessionStub,
        };
      },
    };

    await removeCaseFromTrialInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      disposition: 'because',
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });

    expect(getTrialSessionByIdStub.called).toEqual(true);
    expect(getTrialSessionByIdStub.getCall(0).args[0].trialSessionId).toEqual(
      MOCK_TRIAL_SESSION.trialSessionId,
    );
    expect(updateTrialSessionStub.called).toEqual(true);
    expect(
      updateTrialSessionStub.getCall(1).args[0].trialSessionToUpdate,
    ).toMatchObject({
      ...MOCK_TRIAL_SESSION,
      caseOrder: [{ caseId: 'fa1179bd-04f5-4934-a716-964d8d7babc6' }],
    });
    expect(getCaseByCaseIdStub.called).toEqual(true);
    expect(getCaseByCaseIdStub.getCall(1).args[0].caseId).toEqual(
      MOCK_CASE.caseId,
    );
    expect(createCaseTrialSortMappingRecordsStub.called).toEqual(true);
    expect(
      createCaseTrialSortMappingRecordsStub.getCall(1).args[0].caseId,
    ).toEqual(MOCK_CASE.caseId);
    expect(updateCaseStub.called).toEqual(true);
    expect(updateCaseStub.getCall(1).args[0].caseToUpdate).toMatchObject({
      associatedJudge: Case.CHIEF_JUDGE,
      caseId: MOCK_CASE.caseId,
      status: Case.STATUS_TYPES.generalDocketReadyForTrial,
      trialLocation: undefined,
      trialSessionId: undefined,
    });
  });
});
