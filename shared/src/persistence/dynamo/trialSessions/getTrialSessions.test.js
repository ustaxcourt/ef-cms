const sinon = require('sinon');

const { getTrialSessions } = require('./getTrialSessions');

let applicationContext;

describe('getTrialSessions', () => {
  beforeEach(() => {
    const queryStub = sinon.stub().returns({
      promise: () =>
        Promise.resolve({
          Items: [
            {
              pk: 'trial-session-123',
            },
            {
              pk: 'trial-session-234',
            },
            {
              pk: 'trial-session-345',
            },
          ],
        }),
    });

    applicationContext = {
      environment: {
        stage: 'local',
      },
      getDocumentClient: () => ({
        query: queryStub,
      }),
    };
  });

  it('should get the trial sessions', async () => {
    const result = await getTrialSessions({
      applicationContext,
    });
    expect(result.length).toEqual(3);
  });
});
