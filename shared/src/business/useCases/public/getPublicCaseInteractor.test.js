const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { getPublicCaseInteractor } = require('./getPublicCaseInteractor');

const mockCase = {
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  docketNumber: '123-45',
};

const mockCases = {
  '102-20': {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '102-20',
    sealedDate: '2020-01-02T03:04:05.007Z',
  },
  '123-45': mockCase,
};

describe('getPublicCaseInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        return mockCases[docketNumber];
      });
  });

  it('Should return a Not Found error if the case does not exist', async () => {
    await expect(
      getPublicCaseInteractor({
        applicationContext,
        docketNumber: '999',
      }),
    ).rejects.toThrow('Case 999 was not found.');
  });

  it('Should search by docketNumber when docketNumber parameter is a valid docketNumber', async () => {
    const docketNumber = '123-45';

    const result = await getPublicCaseInteractor({
      applicationContext,
      docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(result).toMatchObject(mockCases[docketNumber]);
  });

  it('should return minimal information when the requested case has been sealed', async () => {
    const docketNumber = '102-20';

    const result = await getPublicCaseInteractor({
      applicationContext,
      docketNumber,
    });

    expect(result).toMatchObject({
      docketNumber: '102-20',
    });
  });
});
