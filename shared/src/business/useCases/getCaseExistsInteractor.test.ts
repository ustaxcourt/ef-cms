const { applicationContext } = require('../test/createTestApplicationContext');
const { getCaseExistsInteractor } = require('./getCaseExistsInteractor');
const { MOCK_CASE } = require('../../test/mockCase');

describe('getCaseExistsInteractor', () => {
  it('should format the given docket number before querying persistence, removing leading zeroes and suffix', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    await getCaseExistsInteractor(applicationContext, {
      docketNumber: '000123-19S',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0],
    ).toEqual({
      applicationContext,
      docketNumber: '123-19',
    });
  });

  it('should throw an error when a case with the provided docketNumber is not found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({
        archivedCorrespondences: [],
        archivedDocketEntries: [],
        associatedJudge: [],
        correspondence: [],
        docketEntries: [],
        irsPractitioners: [],
        privatePractitioners: [],
      });

    await expect(
      getCaseExistsInteractor(applicationContext, {
        docketNumber: '123-19',
      }),
    ).rejects.toThrow('Case 123-19 was not found.');
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls.length,
    ).toBe(1);
  });

  it('should return true a case with the provided docketNumber is found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    await expect(
      getCaseExistsInteractor(applicationContext, {
        docketNumber: '1000-01',
      }),
    ).resolves.toEqual(true);
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
  });
});
