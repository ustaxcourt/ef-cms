const faker = require('faker');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateAssociatedJudgeOnWorkItems,
} = require('./updateAssociatedJudgeOnWorkItems');

describe('updateAssociatedJudgeOnWorkItems', () => {
  const workItemsResults = [
    { pk: 'gotta', sk: 'cut' },
    { pk: 'foot', sk: 'loose' },
  ];
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getWorkItemsByWorkItemId.mockReturnValue(workItemsResults);
  });

  it('gets work items using the workItemId and calls update for each in the results', async () => {
    const workItemId = faker.datatype.uuid();
    const associatedJudge = 'Judge Kevin Bacon';

    await updateAssociatedJudgeOnWorkItems({
      applicationContext,
      associatedJudge,
      workItemId,
    });
    expect(
      applicationContext.getPersistenceGateway().getWorkItemsByWorkItemId,
    ).toHaveBeenCalledWith({ applicationContext, workItemId });

    expect(
      applicationContext.getPersistenceGateway().updateWorkItemAssociatedJudge,
    ).toHaveBeenCalledTimes(workItemsResults.length);

    expect(
      applicationContext.getPersistenceGateway().updateWorkItemAssociatedJudge
        .mock.calls[0][0],
    ).toMatchObject({
      applicationContext,
      associatedJudge,
      workItem: workItemsResults[0],
    });
  });
});
