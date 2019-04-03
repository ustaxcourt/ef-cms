const { addWorkItemToSectionInbox } = require('./addWorkItemToSectionInbox');

const client = require('../../dynamodbClientService');
const sinon = require('sinon');

describe('addWorkItemToSectionInbox', () => {
  let getCurrentUserStub;

  beforeEach(() => {
    sinon.stub(client, 'put').resolves([
      {
        pk: 'abc',
        sk: 'abc',
        workItemId: 'abc',
      },
    ]);

    getCurrentUserStub = sinon.stub().returns({
      section: 'docket',
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });

  afterEach(() => {
    client.put.restore();
  });

  it('invokes the peristence layer with pk of {section}|workItem and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCurrentUser: getCurrentUserStub,
    };
    await addWorkItemToSectionInbox({
      applicationContext,
      workItem: {
        section: 'docket',
        workItemId: '123',
      },
    });
    expect(client.put.getCall(0).args[0]).toMatchObject({
      applicationContext: { environment: { stage: 'dev' } },
      Item: {
        pk: 'docket|workItem',
        sk: '123',
      },
    });
  });
});
