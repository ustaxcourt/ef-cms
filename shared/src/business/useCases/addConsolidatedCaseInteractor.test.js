const {
  addConsolidatedCaseInteractor,
} = require('./addConsolidatedCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

let getCaseByCaseIdMock;
let updateCaseMock;
let applicationContext;
let mockCases;

describe('addConsolidatedCaseInteractor', () => {
  beforeEach(() => {
    mockCases = {
      '000ba5a9-b37b-479d-9201-067ec6e33000': {
        ...MOCK_CASE,
        caseId: '000ba5a9-b37b-479d-9201-067ec6e33000',
        createdAt: '2019-02-19T17:29:13.120Z',
      },
      '111ba5a9-b37b-479d-9201-067ec6e33111': {
        ...MOCK_CASE,
        caseId: '111ba5a9-b37b-479d-9201-067ec6e33111',
        createdAt: '2019-04-19T17:29:13.120Z',
        leadCaseId: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
      },
      'aaaba5a9-b37b-479d-9201-067ec6e33aaa': {
        ...MOCK_CASE,
        caseId: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
        createdAt: '2019-03-19T17:29:13.120Z',
        leadCaseId: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
      },
      'c54ba5a9-b37b-479d-9201-067ec6e335bb': {
        ...MOCK_CASE,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        createdAt: '2019-05-19T17:29:13.120Z',
      },
      'd44ba5a9-b37b-479d-9201-067ec6e335aa': {
        ...MOCK_CASE,
        caseId: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
        createdAt: '2019-03-19T17:29:13.120Z',
      },
    };

    getCaseByCaseIdMock = jest.fn(({ caseId }) => mockCases[caseId]);
    updateCaseMock = jest.fn(({ caseToUpdate }) => caseToUpdate);

    applicationContext = {
      getCurrentUser: () => ({
        role: User.ROLES.docketClerk,
      }),
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseByCaseIdMock,
        getCasesByLeadCaseId: ({ leadCaseId }) => {
          return Object.keys(mockCases)
            .map(key => mockCases[key])
            .filter(mockCase => mockCase.leadCaseId === leadCaseId);
        },
        updateCase: updateCaseMock,
      }),
    };
  });

  it('Should return an Unauthorized error if the user does not have the CONSOLIDATE_CASES permission', async () => {
    let error;
    applicationContext.getCurrentUser = () => ({
      role: User.ROLES.petitioner,
    });

    try {
      await addConsolidatedCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        caseIdToConsolidateWith: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain('Unauthorized for case consolidation');
  });

  it('Should try to get the case by its caseId', async () => {
    await addConsolidatedCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseIdToConsolidateWith: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
    });

    expect(getCaseByCaseIdMock).toHaveBeenCalled();
  });

  it('Should return a Not Found error if the case to update can not be found', async () => {
    let error;

    try {
      await addConsolidatedCaseInteractor({
        applicationContext,
        caseId: 'xxxba5a9-b37b-479d-9201-067ec6e33xxx',
        caseIdToConsolidateWith: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain(
      'Case xxxba5a9-b37b-479d-9201-067ec6e33xxx was not found.',
    );
  });

  it('Should return a Not Found error if the case to conslidate with can not be found', async () => {
    let error;

    try {
      await addConsolidatedCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseIdToConsolidateWith: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
    });

    expect(updateCaseMock).toHaveBeenCalledTimes(2);
  });

  it('Should NOT update the case to consolidate with if it already has the leadCaseId and is the lead case', async () => {
    await addConsolidatedCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseIdToConsolidateWith: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
    });

    expect(updateCaseMock).toHaveBeenCalledTimes(1);
  });

  it('Should update both cases with the leadCaseId if neither have one', async () => {
    const result = await addConsolidatedCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseIdToConsolidateWith: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
    });

    expect(updateCaseMock).toHaveBeenCalled();
    expect(result[0].leadCaseId).toEqual(
      'd44ba5a9-b37b-479d-9201-067ec6e335aa',
    );
  });

  it('Should update all leadCaseId fields if the new case is older', async () => {
    const result = await addConsolidatedCaseInteractor({
      applicationContext,
      caseId: '000ba5a9-b37b-479d-9201-067ec6e33000',
      caseIdToConsolidateWith: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
    });

    expect(updateCaseMock).toHaveBeenCalledTimes(3);
    expect(result[0].leadCaseId).toEqual(
      '000ba5a9-b37b-479d-9201-067ec6e33000',
    );
  });
});
