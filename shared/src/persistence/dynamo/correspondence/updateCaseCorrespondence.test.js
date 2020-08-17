const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateCaseCorrespondence } = require('./updateCaseCorrespondence');

describe('updateCaseCorrespondence', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
  });

  it('should update the specified correspondence record', async () => {
    await updateCaseCorrespondence({
      applicationContext,
      docketNumber: '101-20',
      documentId: '123',
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: 'case|101-20',
        sk: 'correspondence|123',
      },
      TableName: 'efcms-dev',
    });
  });
});
