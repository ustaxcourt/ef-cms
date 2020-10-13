const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteCaseDeadline } = require('./deleteCaseDeadline');

describe('deleteCaseDeadline', () => {
  it('deletes the case deadline records', async () => {
    await deleteCaseDeadline({
      applicationContext,
      caseDeadlineId: '123',
      docketNumber: '456-20',
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: 'case-deadline|123',
        sk: 'case-deadline|123',
      },
    });
    expect(
      applicationContext.getDocumentClient().delete.mock.calls[1][0],
    ).toMatchObject({
      Key: {
        pk: 'case|456-20',
        sk: 'case-deadline|123',
      },
    });
    expect(
      applicationContext.getDocumentClient().delete.mock.calls[2][0],
    ).toMatchObject({
      Key: {
        gsi1pk: 'case-deadline-catalog|123',
        pk: 'case-deadline-catalog',
      },
    });
  });
});
