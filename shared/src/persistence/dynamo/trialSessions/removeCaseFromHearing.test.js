const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { removeCaseFromHearing } = require('./removeCaseFromHearing');

describe('removeCaseFromHearing', () => {
  it('removes a mapping record for the case / hearing', async () => {
    await removeCaseFromHearing({
      applicationContext,
      docketNumber: '1266-20',
      trialSessionId: '8987',
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: 'case|1266-20',
        sk: 'hearing|8987',
      },
    });
  });
});
