const { deleteWorkItemFromSection } = require('./deleteWorkItemFromSection');

const client = require('../../dynamodbClientService');
const sinon = require('sinon');

describe('deleteWorkItemFromSection', () => {
  beforeEach(() => {
    sinon.stub(client, 'delete').resolves(null);
  });

  it('invokes the peristence layer with pk of irsHoldingQueue|workItem and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    await deleteWorkItemFromSection({
      applicationContext,
      section: 'irsHoldingQueue',
      workItemId: '123',
    });
    expect(client.delete.getCall(0).args[0]).toEqual({
      applicationContext: { environment: { stage: 'dev' } },
      key: {
        pk: 'irsHoldingQueue|workItem',
        sk: '123',
      },
    });
  });
});
