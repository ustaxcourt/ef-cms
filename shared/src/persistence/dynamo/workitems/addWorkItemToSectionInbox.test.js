const sinon = require('sinon');
const { addWorkItemToSectionInbox } = require('./addWorkItemToSectionInbox');

describe('addWorkItemToSectionInbox', () => {
  let putStub;

  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => true,
    });
  });

  it('invokes the persistence layer with pk of {section}|workItem and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
    await addWorkItemToSectionInbox({
      applicationContext,
      workItem: {
        section: 'docket',
        workItemId: '123',
      },
    });
    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        pk: 'section-docket',
        sk: 'workitem-123',
      },
      applicationContext: { environment: { stage: 'dev' } },
    });
  });
});
