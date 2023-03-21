const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateCaseStatusOnWorkItems,
} = require('./updateCaseStatusOnWorkItems');
const { faker } = require('@faker-js/faker');

describe('updateCaseStatusOnWorkItems', () => {
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
      docketNumber: '101-20',
      workItemId: 'abc',
    });
    expect(
      applicationContext.getPersistenceGateway().updateWorkItemCaseStatus.mock
        .calls[1][0],
    ).toMatchObject({
      applicationContext,
      caseStatus,
      docketNumber: '101-20',
      workItemId: 'abc',
    });
  });
});
