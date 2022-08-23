const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateAssociatedJudgeOnWorkItems,
} = require('./updateAssociatedJudgeOnWorkItems');
const { faker } = require('@faker-js/faker');

describe('updateAssociatedJudgeOnWorkItems', () => {
  const workItemsResults = [
    { docketNumber: '101-20', pk: 'gotta', sk: 'cut', workItemId: 'abc' },
    { docketNumber: '101-20', pk: 'foot', sk: 'loose', workItemId: 'abc' },
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
      docketNumber: '101-20',
      workItemId: 'abc',
    });
    expect(
      applicationContext.getPersistenceGateway().updateWorkItemAssociatedJudge
        .mock.calls[1][0],
    ).toMatchObject({
      applicationContext,
      associatedJudge,
      docketNumber: '101-20',
      workItemId: 'abc',
    });
  });
});
