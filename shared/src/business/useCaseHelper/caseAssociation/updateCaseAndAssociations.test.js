const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../../src/test/mockCase');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');
const { updateCaseAndAssociations } = require('./updateCaseAndAssociations');

describe('updateCaseAndAssociations', () => {
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

  let updateCaseMock = jest.fn();
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(updateCaseMock);
  });

  it('gets the old case before passing it to updateCase persistence method', async () => {
    const caseToUpdate = {
      ...MOCK_CASE,
    };
    const oldCase = {
      ...MOCK_CASE,
    };
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(oldCase);

    await updateCaseAndAssociations({
      applicationContext,
      caseToUpdate,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0],
    ).toMatchObject({ applicationContext, caseToUpdate, oldCase });
  });

  it('always sends valid entities to the updateCase persistence method', async () => {
    await updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: MOCK_CASE,
    });
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(updateCaseMock).toHaveBeenCalled();
    const updateArgs = updateCaseMock.mock.calls[0][0];

    expect(updateArgs.caseToUpdate.isValidated).toBe(true);
    expect(updateArgs.oldCase.isValidated).toBe(true);
  });

  it('updates hearings, removing old ones from the given case', async () => {
    const trialSessionIds = [
      applicationContext.getUniqueId(),
      applicationContext.getUniqueId(),
      applicationContext.getUniqueId(),
    ];

    const { docketNumber } = MOCK_CASE;
    const caseToUpdate = {
      ...MOCK_CASE,
      docketNumber,
      hearings: [{ ...MOCK_TRIAL_SESSION, trialSessionId: trialSessionIds[0] }],
    };
    const oldCase = {
      ...MOCK_CASE,
      docketNumber,
      hearings: [
        { ...MOCK_TRIAL_SESSION, trialSessionId: trialSessionIds[0] },
        { ...MOCK_TRIAL_SESSION, trialSessionId: trialSessionIds[1] },
        { ...MOCK_TRIAL_SESSION, trialSessionId: trialSessionIds[2] },
      ],
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(oldCase);

    await updateCaseAndAssociations({
      applicationContext,
      caseToUpdate,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0],
    ).toMatchObject({ applicationContext, caseToUpdate, oldCase });
    expect(
      applicationContext.getPersistenceGateway().removeCaseFromHearing,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getPersistenceGateway().removeCaseFromHearing.mock
        .calls,
    ).toMatchObject([
      [{ docketNumber, trialSessionId: trialSessionIds[1] }],
      [{ docketNumber, trialSessionId: trialSessionIds[2] }],
    ]);
  });

  describe.only('documents', () => {
    it('adds a case documents which have changed', async () => {
      const { docketNumber } = MOCK_CASE;
      const oldCase = {
        ...MOCK_CASE,
        archivedDocketEntries: [],
        docketEntries: [],
      };
      const caseToUpdate = {
        ...oldCase,
        archivedDocketEntries: [MOCK_DOCUMENTS[0], MOCK_DOCUMENTS[1]],
        docketEntries: [MOCK_DOCUMENTS[0]],
      };
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(oldCase);

      await updateCaseAndAssociations({
        applicationContext,
        caseToUpdate,
      });

      expect(
        applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0],
      ).toMatchObject({ applicationContext, caseToUpdate, oldCase });

      expect(
        applicationContext.getPersistenceGateway().updateDocketEntry,
      ).toHaveBeenCalledTimes(2);

      expect(
        applicationContext.getPersistenceGateway().updateDocketEntry.mock.calls,
      ).toMatchObject([
        [{ docketNumber, trialSessionId: 'hi' }],
        [{ docketNumber, trialSessionId: 'ho' }],
      ]);
    });
  });
});
