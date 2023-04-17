import { applicationContext } from '../../test/createTestApplicationContext';
import { faker } from '@faker-js/faker';
import { updateLeadDocketNumberOnWorkItems } from './updateLeadDocketNumberOnWorkItems';

describe('updateLeadDocketNumberOnWorkItems', () => {
  const workItemsResults = [
    { docketNumber: '101-20', pk: 'hi', sk: 'there', workItemId: 'abc' },
    { docketNumber: '101-20', pk: 'some', sk: 'body', workItemId: 'abc' },
  ];
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getWorkItemsByWorkItemId.mockResolvedValue(workItemsResults);
  });

  it('gets work items using the workItemId and calls update for each in the results', async () => {
    const workItemId = faker.datatype.uuid();
    const leadDocketNumber = '1424-20';

    await updateLeadDocketNumberOnWorkItems({
      applicationContext,
      leadDocketNumber,
      workItemId,
    });

    expect(
      applicationContext.getPersistenceGateway().getWorkItemsByWorkItemId.mock
        .calls[0][0],
    ).toMatchObject({ workItemId });

    expect(
      applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord,
    ).toHaveBeenCalledTimes(workItemsResults.length);

    expect(
      applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord
        .mock.calls[0][0],
    ).toMatchObject({
      attributeKey: 'leadDocketNumber',
      attributeValue: leadDocketNumber,
      pk: workItemsResults[0].pk,
      sk: workItemsResults[0].sk,
    });
    expect(
      applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord
        .mock.calls[1][0],
    ).toMatchObject({
      attributeKey: 'leadDocketNumber',
      attributeValue: leadDocketNumber,
      pk: workItemsResults[1].pk,
      sk: workItemsResults[1].sk,
    });
  });
});
