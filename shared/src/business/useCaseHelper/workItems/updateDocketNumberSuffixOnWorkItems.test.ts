const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateDocketNumberSuffixOnWorkItems,
} = require('./updateDocketNumberSuffixOnWorkItems');
const { faker } = require('@faker-js/faker');

describe('updateDocketNumberSuffixOnWorkItems', () => {
  const workItemsResults = [
    { docketNumber: '101-20', pk: 'hi', sk: 'there', workItemId: 'abc' },
    { docketNumber: '101-20', pk: 'some', sk: 'body', workItemId: 'abc' },
  ];
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getWorkItemsByWorkItemId.mockReturnValue(workItemsResults);
  });

  it('gets work items using the workItemId and calls update for each in the results', async () => {
    const workItemId = faker.datatype.uuid();
    const docketNumberSuffix = 'ZZ';

    await updateDocketNumberSuffixOnWorkItems({
      applicationContext,
      docketNumberSuffix,
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
      attributeKey: 'docketNumberSuffix',
      attributeValue: docketNumberSuffix,
      pk: workItemsResults[0].pk,
      sk: workItemsResults[0].sk,
    });
    expect(
      applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord
        .mock.calls[1][0],
    ).toMatchObject({
      applicationContext,
      attributeKey: 'docketNumberSuffix',
      attributeValue: docketNumberSuffix,
      pk: workItemsResults[1].pk,
      sk: workItemsResults[1].sk,
    });
  });
});
