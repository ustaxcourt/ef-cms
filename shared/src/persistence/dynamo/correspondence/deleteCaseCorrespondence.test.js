const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteCaseCorrespondence } = require('./deleteCaseCorrespondence');

describe('deleteCaseCorrespondence', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
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
        pk: 'case|101-20',
        sk: 'correspondence|123',
      },
      TableName: 'efcms-dev',
    });
  });
});
