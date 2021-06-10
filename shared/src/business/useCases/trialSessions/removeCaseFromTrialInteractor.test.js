const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  removeCaseFromTrialInteractor,
} = require('./removeCaseFromTrialInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');

describe('remove case from trial session', () => {
  const MOCK_TRIAL_SESSION = {
    address1: '123 Street Lane',
    caseOrder: [
      { docketNumber: MOCK_CASE.docketNumber },
      { docketNumber: '123-45' },
    ],
    city: 'Scottsburg',
    judge: {
      name: 'A Judge',
      userId: '55f4fc65-b33e-4c04-8561-3e56d533f386',
    },
    maxCases: 100,
    postalCode: '47130',
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    sessionType: 'Regular',
    startDate: '3000-03-01T00:00:00.000Z',
    state: 'IN',
    term: 'Fall',
    termYear: '3000',
    trialLocation: 'Birmingham, Alabama',
    trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
  };

  let user;
  let mockTrialSession;

  beforeEach(() => {
    user = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };

    applicationContext.getCurrentUser.mockImplementation(() => user);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        associatedJudge: 'someone',
        trialDate: '2018-03-01T00:00:00.000Z',
        trialLocation: 'Boise, Idaho',
        trialSessionId: '9047d1ab-18d0-43ec-bafb-654e83405416',
      });
    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        associatedJudge: 'someone',
        trialDate: '2018-03-01T00:00:00.000Z',
        trialLocation: 'Boise, Idaho',
        trialSessionId: '9047d1ab-18d0-43ec-bafb-654e83405416',
      });
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => mockTrialSession);

    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(v => v.caseToUpdate);
  });

  it('throws error if user is unauthorized', async () => {
    user = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };
    mockTrialSession = MOCK_TRIAL_SESSION;

    await expect(
      removeCaseFromTrialInteractor(applicationContext, {
        disposition: 'because',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      }),
    ).rejects.toThrow();
  });

  it('calls getTrialSessionById, updateTrialSession, getCaseByDocketNumber, and updateCase persistence methods with correct parameters for a calendared session', async () => {
    mockTrialSession = { ...MOCK_TRIAL_SESSION, isCalendared: true };

    await removeCaseFromTrialInteractor(applicationContext, {
      disposition: 'because',
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById.mock
        .calls[0][0].trialSessionId,
    ).toEqual(MOCK_TRIAL_SESSION.trialSessionId);
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      ...MOCK_TRIAL_SESSION,
      caseOrder: [
        {
          disposition: 'because',
          docketNumber: MOCK_CASE.docketNumber,
          removedFromTrial: true,
        },
        { docketNumber: '123-45' },
      ],
    });
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      associatedJudge: CHIEF_JUDGE,
      docketNumber: MOCK_CASE.docketNumber,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      trialLocation: undefined,
      trialSessionId: undefined,
    });
  });

  it('calls getTrialSessionById, updateTrialSession, getCaseByDocketNumber, updateCaseAutomaticBlock, and updateCase persistence methods with correct parameters for a not calendared session', async () => {
    mockTrialSession = { ...MOCK_TRIAL_SESSION, isCalendared: false };

    await removeCaseFromTrialInteractor(applicationContext, {
      disposition: 'because',
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById.mock
        .calls[0][0].trialSessionId,
    ).toEqual(MOCK_TRIAL_SESSION.trialSessionId);
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      ...MOCK_TRIAL_SESSION,
      caseOrder: [{ docketNumber: '123-45' }],
    });
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAutomaticBlock,
    ).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAutomaticBlock.mock
        .calls[0][0].caseEntity,
    ).toMatchObject({ docketNumber: '101-18' });
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      associatedJudge: CHIEF_JUDGE,
      docketNumber: MOCK_CASE.docketNumber,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      trialLocation: undefined,
      trialSessionId: undefined,
    });
  });

  it('updates work items to be not high priority', async () => {
    mockTrialSession = { ...MOCK_TRIAL_SESSION, isCalendared: true };

    await removeCaseFromTrialInteractor(applicationContext, {
      disposition: 'because',
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });

    expect(
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems.mock
        .calls[0][0],
    ).toMatchObject({
      highPriority: false,
    });
  });

  it('should not call createCaseTrialSortMappingRecords if case is missing trial city', async () => {
    mockTrialSession = { ...MOCK_TRIAL_SESSION, isCalendared: true };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        associatedJudge: 'someone',
        preferredTrialCity: null,
        trialDate: '2018-03-01T00:00:00.000Z',
        trialLocation: 'Boise, Idaho',

        trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      });

    await removeCaseFromTrialInteractor(applicationContext, {
      disposition: 'because',
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toBeCalled();
  });

  it('calls getTrialSessionById, updateTrialSession, getCaseByDocketNumber, and updateCase persistence methods with correct parameters for a non-calendared hearing', async () => {
    mockTrialSession = { ...MOCK_TRIAL_SESSION, isCalendared: false };
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        associatedJudge: 'someone',
        hearings: [mockTrialSession],
        trialDate: '2019-08-25T05:00:00.000Z',
        trialLocation: 'Boise, Idaho',
        trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      });

    await removeCaseFromTrialInteractor(applicationContext, {
      disposition: 'because',
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById.mock
        .calls[0][0].trialSessionId,
    ).toEqual(MOCK_TRIAL_SESSION.trialSessionId);
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      ...MOCK_TRIAL_SESSION,
      caseOrder: [{ docketNumber: '123-45' }],
    });
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAutomaticBlock,
    ).not.toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
      hearings: [],
    });
  });

  it('sets the associatedJudge and caseStatus when provided', async () => {
    mockTrialSession = { ...MOCK_TRIAL_SESSION, isCalendared: true };

    const result = await removeCaseFromTrialInteractor(applicationContext, {
      associatedJudge: 'Judge Dredd',
      caseStatus: CASE_STATUS_TYPES.cav,
      disposition: 'because',
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });

    expect(result.associatedJudge).toEqual('Judge Dredd');
    expect(result.status).toEqual(CASE_STATUS_TYPES.cav);
  });
});
