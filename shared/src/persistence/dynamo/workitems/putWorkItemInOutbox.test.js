const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  DOCKET_SECTION,
} = require('../../../business/entities/EntityConstants');
const { putWorkItemInOutbox } = require('./putWorkItemInOutbox');

describe('putWorkItemInOutbox', () => {
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

  it('invokes the persistence layer with pk of {userId}|outbox and {section}|outbox and other expected params', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: DOCKET_SECTION,
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getDocumentClient.mockReturnValue({
      get: getStub,
      put: putStub,
    });
    await putWorkItemInOutbox({
      applicationContext,
      workItem: {
        workItemId: '123',
      },
    });
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: 'user-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        workItemId: '123',
      },
    });
    expect(putStub.mock.calls[1][0]).toMatchObject({
      Item: {
        pk: 'section-outbox|docket',
        workItemId: '123',
      },
    });
  });
});
