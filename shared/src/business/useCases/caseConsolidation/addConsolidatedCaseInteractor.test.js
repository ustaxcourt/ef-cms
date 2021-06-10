const {
  addConsolidatedCaseInteractor,
} = require('./addConsolidatedCaseInteractor');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');

let mockCases;

describe('addConsolidatedCaseInteractor', () => {
  beforeEach(() => {
    mockCases = {
      '119-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '119-19',
        leadDocketNumber: '119-19',
      },
      '219-19': {
        ...MOCK_CASE,
        createdAt: '2019-02-19T17:29:13.120Z',
        docketNumber: '219-19',
      },
      '319-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '319-19',
        leadDocketNumber: '319-19',
      },
      '320-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '320-19',
      },
      '419-19': {
        ...MOCK_CASE,
        createdAt: '2019-04-19T17:29:13.120Z',
        docketNumber: '419-19',
        leadDocketNumber: '319-19',
      },
      '519-19': {
        ...MOCK_CASE,
        createdAt: '2019-05-19T17:29:13.120Z',
        docketNumber: '519-19',
      },
      '619-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '619-19',
        leadDocketNumber: '119-19',
      },
    };

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        return mockCases[docketNumber];
      });
    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        return mockCases[docketNumber];
      });
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockImplementation(({ leadDocketNumber }) => {
        return Object.keys(mockCases)
          .map(key => mockCases[key])
          .filter(mockCase => mockCase.leadDocketNumber === leadDocketNumber);
      });
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(({ caseToUpdate }) => caseToUpdate);
  });

  it('Should return an Unauthorized error if the user does not have the CONSOLIDATE_CASES permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
    });

    await expect(
      addConsolidatedCaseInteractor(applicationContext, {
        docketNumber: '519-19',
        docketNumberToConsolidateWith: '319-19',
      }),
    ).rejects.toThrow('Unauthorized for case consolidation');
  });

  it('Should try to get the case by its docketNumber', async () => {
    await addConsolidatedCaseInteractor(applicationContext, {
      docketNumber: '519-19',
      docketNumberToConsolidateWith: '319-19',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
  });

  it('Should return a Not Found error if the case to update can not be found', async () => {
    await expect(
      addConsolidatedCaseInteractor(applicationContext, {
        docketNumber: '111-11',
        docketNumberToConsolidateWith: '319-19',
      }),
    ).rejects.toThrow('Case 111-11 was not found.');
  });

  it('Should return a Not Found error if the case to consolidate with cannot be found', async () => {
    await expect(
      addConsolidatedCaseInteractor(applicationContext, {
        docketNumber: '519-19',
        docketNumberToConsolidateWith: '111-11',
      }),
    ).rejects.toThrow('Case to consolidate with (111-11) was not found.');
  });

  it('Should update the case to consolidate with if it does not already have the leadDocketNumber', async () => {
    await addConsolidatedCaseInteractor(applicationContext, {
      docketNumber: '519-19',
      docketNumberToConsolidateWith: '320-19',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls.length,
    ).toEqual(2);
  });

  it('Should NOT update the case to consolidate with if it already has the leadDocketNumber and is the lead case', async () => {
    await addConsolidatedCaseInteractor(applicationContext, {
      docketNumber: '519-19',
      docketNumberToConsolidateWith: '319-19',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls.length,
    ).toEqual(1);
  });

  it('Should update both cases with the leadDocketNumber if neither have one', async () => {
    await addConsolidatedCaseInteractor(applicationContext, {
      docketNumber: '519-19',
      docketNumberToConsolidateWith: '319-19',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.leadDocketNumber,
    ).toEqual('319-19');
  });

  it('Should update all leadDocketNumber fields if the new case has the lower docket number', async () => {
    await addConsolidatedCaseInteractor(applicationContext, {
      docketNumber: '219-19',
      docketNumberToConsolidateWith: '319-19',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls.length,
    ).toEqual(3);
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.leadDocketNumber,
    ).toEqual('219-19');
  });

  it('Should combine all cases when both the case and case to consolidate with are in separate consolidated sets', async () => {
    await addConsolidatedCaseInteractor(applicationContext, {
      docketNumber: '119-19',
      docketNumberToConsolidateWith: '419-19',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls.length,
    ).toEqual(2);
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.leadDocketNumber,
    ).toEqual('119-19');
  });
});
