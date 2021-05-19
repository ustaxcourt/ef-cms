const faker = require('faker');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateDocketNumberSuffixOnWorkItems,
} = require('./updateDocketNumberSuffixOnWorkItems');

describe('updateDocketNumberSuffixOnWorkItems', () => {
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
      applicationContext.getPersistenceGateway()
        .updateWorkItemDocketNumberSuffix,
    ).toHaveBeenCalledTimes(workItemsResults.length);

    expect(
      applicationContext.getPersistenceGateway()
        .updateWorkItemDocketNumberSuffix.mock.calls[0][0],
    ).toMatchObject({
      applicationContext,
      docketNumberSuffix,
      workItem: workItemsResults[0],
    });
  });
});
