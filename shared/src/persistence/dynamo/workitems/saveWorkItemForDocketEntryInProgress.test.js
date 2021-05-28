const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  DOCKET_SECTION,
} = require('../../../business/entities/EntityConstants');
const {
  saveWorkItemForDocketEntryInProgress,
} = require('./saveWorkItemForDocketEntryInProgress');

describe('saveWorkItemForDocketEntryInProgress', () => {
  let putStub;

  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    applicationContext.getDocumentClient.mockReturnValue({
      put: putStub,
    });
  });

  it('invokes the persistence layer 2 times to store the work item and work item mapping record', async () => {
    await saveWorkItemForDocketEntryInProgress({
      applicationContext,
      workItem: {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: '456-20',
        section: DOCKET_SECTION,
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
        pk: 'case|456-20',
        sk: 'work-item|123',
      },
    });
  });
});
