const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getRecord } = require('./getRecord');

const mockCase = { docketNumber: '123-20', pk: 'case|123-20', sk: 'abc' };

describe('getRecord', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: async () => ({
        Item: mockCase,
      }),
    });
  });

  it('returns the record retrieved from persistence', async () => {
    const result = await getRecord({
      applicationContext,
      recordPk: 'case|123-20',
      recordSk: 'abc',
    });

    expect(
      applicationContext.getDocumentClient().get.mock.calls[0][0],
    ).toMatchObject({
      ExpressionAttributeValues: {
        ':pk': 'case|123-20',
        ':sk': 'abc',
      },
    });
    expect(result).toEqual(mockCase);
  });
});
