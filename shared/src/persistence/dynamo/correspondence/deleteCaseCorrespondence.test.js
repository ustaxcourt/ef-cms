const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteCaseCorrespondence } = require('./deleteCaseCorrespondence');

describe('deleteCaseCorrespondence', () => {
  const CASE_ID = '790b5cea-fb90-4039-a11e-a5cfa9f69d5e';

  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Items: [
            {
              pk: `case|${CASE_ID}`,
              sk: `case|${CASE_ID}`,
            },
          ],
        }),
    });
  });

  it('should delete the specified correspondence record', async () => {
    await deleteCaseCorrespondence({
      applicationContext,
      docketNumber: '101-20',
      documentId: '123',
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: `case|${CASE_ID}`,
        sk: 'correspondence|123',
      },
      TableName: 'efcms-dev',
    });
  });
});
