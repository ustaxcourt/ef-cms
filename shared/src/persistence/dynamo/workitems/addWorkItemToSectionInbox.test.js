const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  DOCKET_SECTION,
} = require('../../../business/entities/EntityConstants');
const { addWorkItemToSectionInbox } = require('./addWorkItemToSectionInbox');

describe('addWorkItemToSectionInbox', () => {
  let putStub;

  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => true,
    });
  });

  it('invokes the persistence layer with pk of {section}|workItem and other expected params', async () => {
    applicationContext.getDocumentClient.mockReturnValue({
      put: putStub,
    });

    await addWorkItemToSectionInbox({
      applicationContext,
      workItem: {
        section: DOCKET_SECTION,
        workItemId: '123',
      },
    });
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: 'section|docket',
        sk: 'work-item|123',
      },
      applicationContext: { environment: { stage: 'local' } },
    });
  });
});
