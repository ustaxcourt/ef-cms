const { getPublicCaseInteractor } = require('./getPublicCaseInteractor');

let applicationContext;
let getCaseByCaseIdMock;
let getCaseByDocketNumberMock;

const mockCase = {
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  docketNumber: '123-45',
};

const getMockCaseByIndex = ({ caseId, docketNumber }) => {
  const mockCases = {
    '123-45': mockCase,
    'c54ba5a9-b37b-479d-9201-067ec6e335bb': mockCase,
  };

  return mockCases[caseId || docketNumber];
};

describe('getPublicCaseInteractor', () => {
  beforeEach(() => {
    getCaseByCaseIdMock = jest.fn(getMockCaseByIndex);
    getCaseByDocketNumberMock = jest.fn(getMockCaseByIndex);

    applicationContext = {
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseByCaseIdMock,
        getCaseByDocketNumber: getCaseByDocketNumberMock,
      }),
    };
  });

  it('Should return a Not Found error if the case does not exist', async () => {
    let error;

    try {
      await getPublicCaseInteractor({
        applicationContext,
        caseId: '999',
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain('Case 999 was not found.');
  });

  it('Should search by caseId when caseId parameter is a valid uuid', async () => {
    const caseId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';

    const result = await getPublicCaseInteractor({
      applicationContext,
      caseId,
    });

    expect(getCaseByCaseIdMock).toHaveBeenCalled();
    expect(result.caseId).toEqual('c54ba5a9-b37b-479d-9201-067ec6e335bb');
  });

  it('Should search by docketNumber when caseId parameter is a valid docketNumber', async () => {
    const caseId = '123-45';

    const result = await getPublicCaseInteractor({
      applicationContext,
      caseId,
    });

    expect(getCaseByDocketNumberMock).toHaveBeenCalled();
    expect(result.docketNumber).toEqual('123-45');
  });
});
