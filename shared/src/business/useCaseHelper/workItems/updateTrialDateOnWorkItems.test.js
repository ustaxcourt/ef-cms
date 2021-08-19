const faker = require('faker');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { updateTrialDateOnWorkItems } = require('./updateTrialDateOnWorkItems');

describe('updateTrialDateOnWorkItems', () => {
  const workItemsResults = [
    { pk: 'sharpest', sk: 'tool' },
    { pk: 'in', sk: 'the shed' },
  ];
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getWorkItemsByWorkItemId.mockReturnValue(workItemsResults);
  });

  it('gets work items using the workItemId and calls update for each in the results', async () => {
    const workItemId = faker.datatype.uuid();
    const trialDate = faker.datatype.datetime();

    await updateTrialDateOnWorkItems({
      applicationContext,
      trialDate,
      workItemId,
    });
    expect(
      applicationContext.getPersistenceGateway().getWorkItemsByWorkItemId,
    ).toHaveBeenCalledWith({ applicationContext, workItemId });

    expect(
      applicationContext.getPersistenceGateway().updateWorkItemTrialDate,
    ).toHaveBeenCalledTimes(workItemsResults.length);

    expect(
      applicationContext.getPersistenceGateway().updateWorkItemTrialDate.mock
        .calls[0][0],
    ).toMatchObject({
      applicationContext,
      trialDate,
      workItem: workItemsResults[0],
    });
  });
});
