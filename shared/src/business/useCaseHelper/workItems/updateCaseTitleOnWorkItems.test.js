const faker = require('faker');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { updateCaseTitleOnWorkItems } = require('./updateCaseTitleOnWorkItems');

describe('updateCaseTitleOnWorkItems', () => {
  const workItemsResults = [
    { pk: 'some', sk: 'body' },
    { pk: 'once', sk: 'told me' },
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
      applicationContext.getPersistenceGateway().updateWorkItemCaseTitle,
    ).toHaveBeenCalledTimes(workItemsResults.length);

    expect(
      applicationContext.getPersistenceGateway().updateWorkItemCaseTitle.mock
        .calls[0][0],
    ).toMatchObject({
      applicationContext,
      caseTitle,
      workItem: workItemsResults[0],
    });
  });
});
