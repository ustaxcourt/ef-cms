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
  trialLocation: 'Birmingham, Alabama',
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
};

describe('remove case from trial session', () => {
  let applicationContext;
  let user;
  const updateTrialSessionStub = jest.fn();
  const getCaseByCaseIdStub = jest.fn().mockReturnValue({
    ...MOCK_CASE,
    associatedJudge: 'someone',
    trialLocation: 'Boise, Idaho',
    trialSessionId: 'abcd',
  });
  const updateCaseStub = jest.fn().mockImplementation(v => v.caseToUpdate);
  const createCaseTrialSortMappingRecordsStub = jest.fn();
  const setPriorityOnAllWorkItemsSpy = jest.fn();
  let getTrialSessionByIdStub;

  beforeEach(() => {
    jest.clearAllMocks();

    user = {
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => user,
      getPersistenceGateway: () => {
        return {
          createCaseTrialSortMappingRecords: createCaseTrialSortMappingRecordsStub,
          getCaseByCaseId: getCaseByCaseIdStub,
          getTrialSessionById: getTrialSessionByIdStub,
          setPriorityOnAllWorkItems: setPriorityOnAllWorkItemsSpy,
          updateCase: updateCaseStub,
          updateTrialSession: updateTrialSessionStub,
        };
      },
      getUniqueId: () => 'd5bb3976-e1f2-4c96-b59e-03b6300c6842',
    };
  });

  it('throws error if user is unauthorized', async () => {
    user = {
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };
    getTrialSessionByIdStub = jest.fn().mockReturnValue(MOCK_TRIAL_SESSION);
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
    getTrialSessionByIdStub = jest
      .fn()
      .mockReturnValue({ ...MOCK_TRIAL_SESSION, isCalendared: true });

    await removeCaseFromTrialInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      disposition: 'because',
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });

    expect(getTrialSessionByIdStub).toBeCalled();
    expect(getTrialSessionByIdStub.mock.calls[0][0].trialSessionId).toEqual(
      MOCK_TRIAL_SESSION.trialSessionId,
    );
    expect(updateTrialSessionStub).toBeCalled();
    expect(
      updateTrialSessionStub.mock.calls[0][0].trialSessionToUpdate,
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
    expect(getCaseByCaseIdStub).toBeCalled();
    expect(getCaseByCaseIdStub.mock.calls[0][0].caseId).toEqual(
      MOCK_CASE.caseId,
    );
    expect(createCaseTrialSortMappingRecordsStub).toBeCalled();
    expect(
      createCaseTrialSortMappingRecordsStub.mock.calls[0][0].caseId,
    ).toEqual(MOCK_CASE.caseId);
    expect(updateCaseStub).toBeCalled();
    expect(updateCaseStub.mock.calls[0][0].caseToUpdate).toMatchObject({
      associatedJudge: Case.CHIEF_JUDGE,
      caseId: MOCK_CASE.caseId,
      status: Case.STATUS_TYPES.generalDocketReadyForTrial,
      trialLocation: undefined,
      trialSessionId: undefined,
    });
  });

  it('calls getTrialSessionById, updateTrialSession, getCaseByCaseId, and updateCase persistence methods with correct parameters for a not calendared session', async () => {
    getTrialSessionByIdStub = jest
      .fn()
      .mockReturnValue({ ...MOCK_TRIAL_SESSION, isCalendared: false });

    await removeCaseFromTrialInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      disposition: 'because',
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });

    expect(getTrialSessionByIdStub).toBeCalled();
    expect(getTrialSessionByIdStub.mock.calls[0][0].trialSessionId).toEqual(
      MOCK_TRIAL_SESSION.trialSessionId,
    );
    expect(updateTrialSessionStub).toBeCalled();
    expect(
      updateTrialSessionStub.mock.calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      ...MOCK_TRIAL_SESSION,
      caseOrder: [{ caseId: 'fa1179bd-04f5-4934-a716-964d8d7babc6' }],
    });
    expect(getCaseByCaseIdStub).toBeCalled();
    expect(getCaseByCaseIdStub.mock.calls[0][0].caseId).toEqual(
      MOCK_CASE.caseId,
    );
    expect(createCaseTrialSortMappingRecordsStub).toBeCalled();
    expect(
      createCaseTrialSortMappingRecordsStub.mock.calls[0][0].caseId,
    ).toEqual(MOCK_CASE.caseId);
    expect(updateCaseStub).toBeCalled();
    expect(updateCaseStub.mock.calls[0][0].caseToUpdate).toMatchObject({
      associatedJudge: Case.CHIEF_JUDGE,
      caseId: MOCK_CASE.caseId,
      status: Case.STATUS_TYPES.generalDocketReadyForTrial,
      trialLocation: undefined,
      trialSessionId: undefined,
    });
  });

  it('updates work items to be not high priority', async () => {
    getTrialSessionByIdStub = jest
      .fn()
      .mockReturnValue({ ...MOCK_TRIAL_SESSION, isCalendared: true });

    await removeCaseFromTrialInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      disposition: 'because',
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });

    expect(setPriorityOnAllWorkItemsSpy).toBeCalled();
    expect(setPriorityOnAllWorkItemsSpy.mock.calls[0][0]).toMatchObject({
      highPriority: false,
    });
  });
});
