const {
  setConsolidatedCaseInteractor,
} = require('./setConsolidatedCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

let getCaseByCaseIdMock;
let updateCaseMock;
let applicationContext;

describe('setConsolidatedCaseInteractor', () => {
  getCaseByCaseIdMock = jest.fn(({ caseId }) => {
    const mockCases = {
      'c54ba5a9-b37b-479d-9201-067ec6e335bb': {
        ...MOCK_CASE,
      },
    };
    return mockCases[caseId];
  });

  updateCaseMock = jest.fn(({ caseToUpdate }) => caseToUpdate);

  beforeEach(() => {
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

  it('Should return an Unauthrized error if the user does not have the CONSOLIDATE_CASES permission', async () => {
    let error;
    applicationContext.getCurrentUser = () => ({
      role: User.ROLES.petitioner,
    });

    try {
      await setConsolidatedCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        leadCaseId: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain('Unauthorized for case consolidation');
  });

  it('Should return a Not Found error if the case can not be found', async () => {
    let error;

    try {
      await setConsolidatedCaseInteractor({
        applicationContext,
        caseId: 'a54ba5a9-b37b-479d-9201-067ec6e335b5',
        leadCaseId: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain(
      'Case a54ba5a9-b37b-479d-9201-067ec6e335b5 was not found.',
    );
  });

  it('Should try to get the case by its caseId', async () => {
    await setConsolidatedCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      leadCaseId: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
    });

    expect(getCaseByCaseIdMock).toHaveBeenCalled();
  });

  it('Should update the case, adding the leadCaseId', async () => {
    const result = await setConsolidatedCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      leadCaseId: 'd44ba5a9-b37b-479d-9201-067ec6e335aa',
    });

    expect(updateCaseMock).toHaveBeenCalled();
    expect(result.leadCaseId).toEqual('d44ba5a9-b37b-479d-9201-067ec6e335aa');
  });
});
