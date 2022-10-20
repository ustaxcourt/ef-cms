const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateCaseHearing } = require('./updateCaseHearing');

describe('updateCaseHearing', () => {
  let putStub;
  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(null),
    });
  });

  it('invokes the persistence layer with pk of case|{docketNumber}, sk of hearing|{trialSessionId} and other expected params', async () => {
    applicationContext.getDocumentClient.mockReturnValue({
      put: putStub,
    });
    await updateCaseHearing({
      applicationContext,
      docketNumber: '123-45',
      hearingToUpdate: {
        caseOrder: [
          {
            calendarNotes: 'Heyo!',
            docketNumber: '123-45',
          },
        ],
        trialSessionId: '123',
      },
    });
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        caseOrder: [
          {
            calendarNotes: 'Heyo!',
            docketNumber: '123-45',
          },
        ],
        pk: 'case|123-45',
        sk: 'hearing|123',
        trialSessionId: '123',
      },
      applicationContext: { environment: { stage: 'local' } },
    });
  });
});
