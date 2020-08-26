const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  DOCKET_SECTION,
} = require('../../../business/entities/EntityConstants');
const {
  saveWorkItemForDocketClerkFilingExternalDocument,
} = require('./saveWorkItemForDocketClerkFilingExternalDocument');

describe('saveWorkItemForDocketClerkFilingExternalDocument', () => {
  let putStub;
  let getStub;

  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => ({
        section: DOCKET_SECTION,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    });
    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          section: DOCKET_SECTION,
          userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        },
      }),
    });
  });

  it('invokes the persistence layer 4 times to store the work item, user and section outbox records, and work item mapping record', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: DOCKET_SECTION,
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getDocumentClient.mockReturnValue({
      get: getStub,
      put: putStub,
    });
    await saveWorkItemForDocketClerkFilingExternalDocument({
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
        pk: 'section-outbox|docket',
        workItemId: '123',
      },
    });
    expect(putStub.mock.calls[2][0]).toMatchObject({
      Item: {
        pk: 'user-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        workItemId: '123',
      },
    });
    expect(putStub.mock.calls[3][0]).toMatchObject({
      Item: {
        pk: 'case|456-20',
        sk: 'work-item|123',
      },
    });
  });
});
