const sinon = require('sinon');
const { putWorkItemInOutbox } = require('./putWorkItemInOutbox');

describe('putWorkItemInOutbox', () => {
  let putStub;
  let getStub;

  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => ({
        section: 'docket',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    });
    getStub = sinon.stub().returns({
      promise: async () => ({
        Item: {
          section: 'docket',
          userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        },
      }),
    });
  });

  it('invokes the persistence layer with pk of {userId}|outbox and {section}|outbox and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCurrentUser: () => ({
        section: 'docket',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      }),
      getDocumentClient: () => ({
        get: getStub,
        put: putStub,
      }),
    };
    await putWorkItemInOutbox({
      applicationContext,
      workItem: {
        workItemId: '123',
      },
    });
    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        pk: 'user-outbox-1805d1ab-18d0-43ec-bafb-654e83405416',
        workItemId: '123',
      },
    });
    expect(putStub.getCall(1).args[0]).toMatchObject({
      Item: {
        pk: 'section-outbox-docket',
        workItemId: '123',
      },
    });
  });
});
