const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getCaseForPublicDocketSearchInteractor,
} = require('./getCaseForPublicDocketSearchInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('Get case for public docket record search', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(Promise.resolve(MOCK_CASE));
  });

  it('should throw an unauthorized error when the found case is sealed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({
        ...MOCK_CASE,
        isSealed: true,
        sealedDate: '2020/05/05',
      });
    await expect(
      getCaseForPublicDocketSearchInteractor({
        applicationContext,
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Case 101-18 is sealed.');
  });

  it('searches for a case by docket number', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    const caseRecord = await getCaseForPublicDocketSearchInteractor({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(caseRecord.caseId).toEqual('c54ba5a9-b37b-479d-9201-067ec6e335bb');
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
  });

  it('should throw an error when unable to find a case by docket number', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(undefined);

    await expect(
      getCaseForPublicDocketSearchInteractor({
        applicationContext,
        docketNumber: '00-111',
      }),
    ).rejects.toThrow('Case 00-111 was not found.');
  });
});
