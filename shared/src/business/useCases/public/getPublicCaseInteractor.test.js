const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { getPublicCaseInteractor } = require('./getPublicCaseInteractor');

const mockCase = {
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  caseTitle: 'a mock case',
  docketNumber: '123-45',
};

const mockCases = {
  '102-20': {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    caseTitle: 'some case title',
    docketNumber: '102-20',
    sealedDate: '2020-01-02T03:04:05.007Z',
  },
  '123-45': mockCase,
  'c54ba5a9-b37b-479d-9201-067ec6e335bb': mockCase,
};

describe('getPublicCaseInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(({ caseId, docketNumber }) => {
        return mockCases[caseId || docketNumber];
      });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ caseId, docketNumber }) => {
        return mockCases[caseId || docketNumber];
      });
  });

  it('Should return a Not Found error if the case does not exist', async () => {
    await expect(
      getPublicCaseInteractor({
        applicationContext,
        caseId: '999',
      }),
    ).rejects.toThrow('Case 999 was not found.');
  });

  it('Should search by caseId when caseId parameter is a valid uuid', async () => {
    const caseId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';

    const result = await getPublicCaseInteractor({
      applicationContext,
      caseId,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toHaveBeenCalled();
    expect(result).toMatchObject(mockCases[caseId]);
  });

  it('Should search by docketNumber when caseId parameter is a valid docketNumber', async () => {
    const caseId = '123-45';

    const result = await getPublicCaseInteractor({
      applicationContext,
      caseId,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(result).toMatchObject(mockCases[caseId]);
  });

  it('should return minimal information when the requested case has been sealed', async () => {
    const caseId = '102-20';

    const result = await getPublicCaseInteractor({
      applicationContext,
      caseId,
    });

    expect(result).toMatchObject({
      caseTitle: undefined,
      docketNumber: '102-20',
    });
  });
});
