const faker = require('faker');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateCaseStatusOnWorkItems,
} = require('./updateCaseStatusOnWorkItems');

describe('updateCaseStatusOnWorkItems', () => {
  const workItemsResults = [
    { pk: 'hi', sk: 'there' },
    { pk: 'some', sk: 'body' },
  ];
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getWorkItemsByWorkItemId.mockReturnValue(workItemsResults);
  });

  it('gets work items using the workItemId and calls update for each in the results', async () => {
    const workItemId = faker.datatype.uuid();
    const caseStatus = "there's a truck outside";

    await updateCaseStatusOnWorkItems({
      applicationContext,
      caseStatus,
      workItemId,
    });
    expect(
      applicationContext.getPersistenceGateway().getWorkItemsByWorkItemId,
    ).toHaveBeenCalledWith({ applicationContext, workItemId });

    expect(
      applicationContext.getPersistenceGateway().updateWorkItemCaseStatus,
    ).toHaveBeenCalledTimes(workItemsResults.length);

    expect(
      applicationContext.getPersistenceGateway().updateWorkItemCaseStatus.mock
        .calls[0][0],
    ).toMatchObject({
      applicationContext,
      caseStatus,
      workItem: workItemsResults[0],
    });
  });
});
