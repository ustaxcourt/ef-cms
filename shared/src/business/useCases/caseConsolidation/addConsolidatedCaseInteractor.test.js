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
      '000ba5a9-b37b-479d-9201-067ec6e33000': {
        ...MOCK_CASE,
        caseId: '000ba5a9-b37b-479d-9201-067ec6e33000',
        createdAt: '2019-02-19T17:29:13.120Z',
        docketNumber: '219-19',
      },
      '111ba5a9-b37b-479d-9201-067ec6e33111': {
        ...MOCK_CASE,
        caseId: '111ba5a9-b37b-479d-9201-067ec6e33111',
        createdAt: '2019-04-19T17:29:13.120Z',
        docketNumber: '419-19',
        leadCaseId: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
      },
      'aaaba5a9-b37b-479d-9201-067ec6e33aaa': {
        ...MOCK_CASE,
        caseId: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '319-19',
        leadCaseId: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
      },
      'bbbba5a9-b37b-479d-9201-067ec6e33bbb': {
        ...MOCK_CASE,
        caseId: 'bbbba5a9-b37b-479d-9201-067ec6e33bbb',
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '119-19',
        leadCaseId: 'bbbba5a9-b37b-479d-9201-067ec6e33bbb',
      },
      'c54ba5a9-b37b-479d-9201-067ec6e335bb': {
        ...MOCK_CASE,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        createdAt: '2019-05-19T17:29:13.120Z',
        docketNumber: '519-19',
      },
      'cccca5a9-b37b-479d-9201-067ec6e33ccc': {
        ...MOCK_CASE,
        caseId: 'cccca5a9-b37b-479d-9201-067ec6e33ccc',
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '619-19',
        leadCaseId: 'bbbba5a9-b37b-479d-9201-067ec6e33bbb',
      },
      'd44ba5a9-b37b-479d-9201-067ec6e335aa': {
        ...MOCK_CASE,
        caseId: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '319-19',
      },
    };

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(({ caseId }) => {
        return mockCases[caseId];
      });
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadCaseId.mockImplementation(({ leadCaseId }) => {
        return Object.keys(mockCases)
          .map(key => mockCases[key])
          .filter(mockCase => mockCase.leadCaseId === leadCaseId);
      });
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(({ caseToUpdate }) => caseToUpdate);
  });

  it('Should return an Unauthorized error if the user does not have the CONSOLIDATE_CASES permission', async () => {
    let error;

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
    });

    try {
      await addConsolidatedCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb', // docketNumber: '519-19'
        caseIdToConsolidateWith: 'd44ba5a9-b37b-479d-9201-067ec6e335aa', // docketNumber: '319-19'
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain('Unauthorized for case consolidation');
  });

  it('Should try to get the case by its caseId', async () => {
    await addConsolidatedCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb', // docketNumber: '519-19'
      caseIdToConsolidateWith: 'd44ba5a9-b37b-479d-9201-067ec6e335aa', // docketNumber: '319-19'
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toHaveBeenCalled();
  });

  it('Should return a Not Found error if the case to update can not be found', async () => {
    let error;

    try {
      await addConsolidatedCaseInteractor({
        applicationContext,
        caseId: 'xxxba5a9-b37b-479d-9201-067ec6e33xxx',
        caseIdToConsolidateWith: 'd44ba5a9-b37b-479d-9201-067ec6e335aa', // docketNumber: '319-19'
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain(
      'Case xxxba5a9-b37b-479d-9201-067ec6e33xxx was not found.',
    );
  });

  it('Should return a Not Found error if the case to consolidate with cannot be found', async () => {
    let error;

    try {
      await addConsolidatedCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb', // docketNumber: '519-19'
        caseIdToConsolidateWith: 'xxxba5a9-b37b-479d-9201-067ec6e33xxx',
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain(
      'Case to consolidate with (xxxba5a9-b37b-479d-9201-067ec6e33xxx) was not found.',
    );
  });

  it('Should update the case to consolidate with if it does not already have the leadCaseId', async () => {
    await addConsolidatedCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb', // docketNumber: '519-19'
      caseIdToConsolidateWith: 'd44ba5a9-b37b-479d-9201-067ec6e335aa', // docketNumber: '319-19'
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls.length,
    ).toEqual(2);
  });

  it('Should NOT update the case to consolidate with if it already has the leadCaseId and is the lead case', async () => {
    await addConsolidatedCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb', // docketNumber: '519-19'
      caseIdToConsolidateWith: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa', // docketNumber: '319-19'
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls.length,
    ).toEqual(1);
  });

  it('Should update both cases with the leadCaseId if neither have one', async () => {
    await addConsolidatedCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb', // docketNumber: '519-19'
      caseIdToConsolidateWith: 'd44ba5a9-b37b-479d-9201-067ec6e335aa', // docketNumber: '319-19'
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.leadCaseId,
    ).toEqual(
      'd44ba5a9-b37b-479d-9201-067ec6e335aa', // docketNumber: '319-19'
    );
  });

  it('Should update all leadCaseId fields if the new case has the lower docket number', async () => {
    await addConsolidatedCaseInteractor({
      applicationContext,
      caseId: '000ba5a9-b37b-479d-9201-067ec6e33000', // docketNumber: '219-19'
      caseIdToConsolidateWith: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa', // docketNumber: '319-19'
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls.length,
    ).toEqual(3);
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.leadCaseId,
    ).toEqual(
      '000ba5a9-b37b-479d-9201-067ec6e33000', // docketNumber: '219-19'
    );
  });

  it('Should combine all cases when both the case and case to consolidate with are in separate consolidated sets', async () => {
    await addConsolidatedCaseInteractor({
      applicationContext,
      caseId: 'bbbba5a9-b37b-479d-9201-067ec6e33bbb', // docketNumber: '219-19'
      caseIdToConsolidateWith: '111ba5a9-b37b-479d-9201-067ec6e33111', // docketNumber: '419-19'
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls.length,
    ).toEqual(2);
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.leadCaseId,
    ).toEqual(
      'bbbba5a9-b37b-479d-9201-067ec6e33bbb', // docketNumber: '219-19'
    );
  });
});
