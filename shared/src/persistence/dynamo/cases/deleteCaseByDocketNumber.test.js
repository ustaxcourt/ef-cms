const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteCaseByDocketNumber } = require('./deleteCaseByDocketNumber');

describe('deleteCaseByDocketNumber', () => {
  const records = [
    { pk: 'case|101-20', sk: 'case|101-20' },
    { pk: 'case|101-20', sk: 'docket-entry|1234-1451-234-1234-1234' },
  ];
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () => Promise.resolve({ Items: records }),
    });
  });

  it('attempts to delete the case', async () => {
    await deleteCaseByDocketNumber({
      applicationContext,
      docketNumber: '101-20',
    });

    expect(applicationContext.getDocumentClient().delete).toHaveBeenCalledTimes(
      2,
    );

    expect(
      applicationContext.getDocumentClient().delete.mock.calls,
    ).toMatchObject([
      [
        {
          Key: records[0],
          TableName: 'efcms-dev',
        },
      ],
      [
        {
          Key: records[1],
          TableName: 'efcms-dev',
        },
      ],
    ]);
  });

  it('does not attempt to delete anything if case is not found', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Items: [],
        }),
    });

    await deleteCaseByDocketNumber({
      applicationContext,
      docketNumber: '123-42',
    });

    expect(applicationContext.getDocumentClient().delete).toHaveBeenCalledTimes(
      0,
    );
  });
});
