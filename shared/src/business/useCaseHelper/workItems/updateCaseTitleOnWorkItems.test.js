const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { faker } = require('@faker-js/faker');
const { updateCaseTitleOnWorkItems } = require('./updateCaseTitleOnWorkItems');

describe('updateCaseTitleOnWorkItems', () => {
  const workItemsResults = [
    { docketNumber: 'some', pk: 'some', sk: 'body', workItemId: 'body' },
    { docketNumber: 'once', pk: 'once', sk: 'told me', workItemId: 'told me' },
  ];
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getWorkItemsByWorkItemId.mockReturnValue(workItemsResults);
  });

  it('gets work items using the workItemId and calls update for each work item returned', async () => {
    const workItemId = faker.datatype.uuid();
    const caseTitle = 'where is my super-suit?';

    await updateCaseTitleOnWorkItems({
      applicationContext,
      caseTitle,
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
      attributeKey: 'caseTitle',
      attributeValue: caseTitle,
      pk: workItemsResults[0].pk,
      sk: workItemsResults[0].sk,
    });
    expect(
      applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord
        .mock.calls[1][0],
    ).toMatchObject({
      applicationContext,
      attributeKey: 'caseTitle',
      attributeValue: caseTitle,
      pk: workItemsResults[1].pk,
      sk: workItemsResults[1].sk,
    });
  });
});
