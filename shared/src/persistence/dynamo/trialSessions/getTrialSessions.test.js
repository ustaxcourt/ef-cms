const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getTrialSessions } = require('./getTrialSessions');

const mockTrialSessions = [
  {
    pk: 'trial-session|123',
  },
  {
    pk: 'trial-session|234',
  },
  {
    pk: 'trial-session|345',
  },
];

describe('getTrialSessions', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Items: mockTrialSessions,
        }),
    });
  });

  it('should get the trial sessions', async () => {
    const result = await getTrialSessions({
      applicationContext,
    });

    expect(result.length).toEqual(mockTrialSessions.length);
  });
});
