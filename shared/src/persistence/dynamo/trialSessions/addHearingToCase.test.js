const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { addHearingToCase } = require('./addHearingToCase');

const mockTrialSession = {
  trialSessionId: '123',
};

describe('addHearingToCase', () => {
  it('attempts to persist the trial session', async () => {
    await addHearingToCase({
      applicationContext,
      docketNumber: '123-20',
      trialSession: mockTrialSession,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'case|123-20',
        sk: 'hearing|123',
        trialSessionId: '123',
      },
    });
  });
});
