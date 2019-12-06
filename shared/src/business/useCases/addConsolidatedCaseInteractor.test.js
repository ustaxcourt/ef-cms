const {
  addConsolidatedCaseInteractor,
} = require('./addConsolidatedCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

let getCaseByCaseIdMock;
let updateCaseMock;
let applicationContext;

describe('addConsolidatedCaseInteractor', () => {
  beforeEach(() => {
    getCaseByCaseIdMock = jest.fn(({ caseId }) => {
      const mockCases = {
        'aaaba5a9-b37b-479d-9201-067ec6e33aaa': {
          ...MOCK_CASE,
          caseId: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
          leadCaseId: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
        },
        'c54ba5a9-b37b-479d-9201-067ec6e335bb': {
          ...MOCK_CASE,
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        'd44ba5a9-b37b-479d-9201-067ec6e335aa': {
          ...MOCK_CASE,
          caseId: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
        },
      };
      return mockCases[caseId];
    });

    updateCaseMock = jest.fn(({ caseToUpdate }) => caseToUpdate);

    applicationContext = {
      getCurrentUser: () => ({
        role: User.ROLES.docketClerk,
      }),
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseByCaseIdMock,
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
        leadCaseId: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain('Unauthorized for case consolidation');
  });

  it('Should return a Not Found error if the case to update can not be found', async () => {
    let error;

    try {
      await addConsolidatedCaseInteractor({
        applicationContext,
        caseId: 'xxxba5a9-b37b-479d-9201-067ec6e33xxx',
        leadCaseId: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain(
      'Case xxxba5a9-b37b-479d-9201-067ec6e33xxx was not found.',
    );
  });

  it('Should return a Not Found error if the lead case can not be found', async () => {
    let error;

    try {
      await addConsolidatedCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        leadCaseId: 'xxxba5a9-b37b-479d-9201-067ec6e33xxx',
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain(
      'Case xxxba5a9-b37b-479d-9201-067ec6e33xxx was not found.',
    );
  });

  it('Should try to get the case by its caseId', async () => {
    await addConsolidatedCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      leadCaseId: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
    });

    expect(getCaseByCaseIdMock).toHaveBeenCalled();
  });

  it('Should update the lead case if it does not already have the leadCaseId', async () => {
    await addConsolidatedCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      leadCaseId: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
    });

    expect(updateCaseMock).toHaveBeenCalledTimes(2);
  });

  it('Should NOT update the lead case if it already has the leadCaseId', async () => {
    await addConsolidatedCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      leadCaseId: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
    });

    expect(updateCaseMock).toHaveBeenCalledTimes(1);
  });

  it('Should update the case, adding the leadCaseId', async () => {
    const result = await addConsolidatedCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      leadCaseId: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
    });

    expect(updateCaseMock).toHaveBeenCalled();
    expect(result.leadCaseId).toEqual('d44ba5a9-b37b-479d-9201-067ec6e335aa');
  });
});
