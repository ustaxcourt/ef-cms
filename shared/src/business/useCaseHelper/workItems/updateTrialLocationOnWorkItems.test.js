const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateTrialLocationOnWorkItems,
} = require('./updateTrialLocationOnWorkItems');
const { faker } = require('@faker-js/faker');

describe('updateTrialLocationOnWorkItems', () => {
  const workItemsResults = [
    { docketNumber: '101-20', pk: 'sharpest', sk: 'tool', workItemId: 'abc' },
    { docketNumber: '101-20', pk: 'in', sk: 'the shed', workItemId: 'abc' },
  ];
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getWorkItemsByWorkItemId.mockReturnValue(workItemsResults);
  });

  it('gets work items using the workItemId and calls update for each in the results', async () => {
    const workItemId = faker.datatype.uuid();
    const trialLocation = 'Phoenix, Arizona';

    await updateTrialLocationOnWorkItems({
      applicationContext,
      trialLocation,
      workItemId,
    });
    expect(
      applicationContext.getPersistenceGateway().getWorkItemsByWorkItemId,
    ).toHaveBeenCalledWith({ applicationContext, workItemId });

    expect(
      applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord,
    ).toHaveBeenCalledTimes(workItemsResults.length);

    expect(
      applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord
        .mock.calls[0][0],
    ).toMatchObject({
      applicationContext,
      attributeKey: 'trialLocation',
      attributeValue: trialLocation,
      pk: workItemsResults[0].pk,
      sk: workItemsResults[0].sk,
    });
    expect(
      applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord
        .mock.calls[1][0],
    ).toMatchObject({
      applicationContext,
      attributeKey: 'trialLocation',
      attributeValue: trialLocation,
      pk: workItemsResults[1].pk,
      sk: workItemsResults[1].sk,
    });
  });
});
