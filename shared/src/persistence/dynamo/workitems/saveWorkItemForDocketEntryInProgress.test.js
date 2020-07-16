const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  saveWorkItemForDocketEntryInProgress,
} = require('./saveWorkItemForDocketEntryInProgress');

describe('saveWorkItemForDocketEntryInProgress', () => {
  let putStub;
  let getStub;

  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => ({
        section: 'docket',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    });
    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          section: 'docket',
          userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        },
      }),
    });
  });

  it('invokes the persistence layer 4 times to store the work item, user and section inbox records, and work item mapping record', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: 'docket',
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getDocumentClient.mockReturnValue({
      get: getStub,
      put: putStub,
    });
    await saveWorkItemForDocketEntryInProgress({
      applicationContext,
      workItem: {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        caseId: '456',
        section: 'docket',
        workItemId: '123',
      },
    });

    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: 'work-item|123',
        sk: 'work-item|123',
      },
    });
    expect(putStub.mock.calls[1][0]).toMatchObject({
      Item: {
        pk: 'section|docket',
        workItemId: '123',
      },
    });
    expect(putStub.mock.calls[2][0]).toMatchObject({
      Item: {
        pk: 'user|1805d1ab-18d0-43ec-bafb-654e83405416',
        workItemId: '123',
      },
    });
    expect(putStub.mock.calls[3][0]).toMatchObject({
      Item: {
        pk: 'case|456',
        sk: 'work-item|123',
      },
    });
  });
});
