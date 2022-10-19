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
      promise: () =>
        Promise.resolve({
          section: DOCKET_SECTION,
          userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        }),
    });
    getStub = jest.fn().mockReturnValue({
      promise: () =>
        Promise.resolve({
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
        completedAt: '2021-03-30T17:25:38.186Z',
        docketNumber: '456-20',
        section: DOCKET_SECTION,
        workItemId: '123',
      },
    });

    expect(putStub.mock.calls).toEqual(
      expect.arrayContaining([
        // section outbox
        expect.arrayContaining([
          expect.objectContaining({
            Item: expect.objectContaining({
              gsi1pk: 'work-item|123',
              pk: 'section-outbox|docket',
              sk: '2021-03-30T17:25:38.186Z',
              workItemId: '123',
            }),
          }),
        ]),
        // section outbox archive
        expect.arrayContaining([
          expect.objectContaining({
            Item: expect.objectContaining({
              gsi1pk: 'work-item|123',
              pk: 'section-outbox|docket|2021-03',
              sk: '2021-03-30T17:25:38.186Z',
              workItemId: '123',
            }),
          }),
        ]),
        // user outbox
        expect.arrayContaining([
          expect.objectContaining({
            Item: expect.objectContaining({
              gsi1pk: 'work-item|123',
              pk: 'user-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
              sk: '2021-03-30T17:25:38.186Z',
              workItemId: '123',
            }),
          }),
        ]),
        // main work item associated with case
        expect.arrayContaining([
          expect.objectContaining({
            Item: expect.objectContaining({
              gsi1pk: 'work-item|123',
              pk: 'case|456-20',
              sk: 'work-item|123',
              workItemId: '123',
            }),
          }),
        ]),
      ]),
    );
  });
});
