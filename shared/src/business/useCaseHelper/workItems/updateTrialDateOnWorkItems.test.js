const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { faker } = require('@faker-js/faker');
const { updateTrialDateOnWorkItems } = require('./updateTrialDateOnWorkItems');

describe('updateTrialDateOnWorkItems', () => {
  const workItemsResults = [
    { docketNumber: '101-20', pk: 'sharpest', sk: 'tool', workItemId: 'abc' },
    { docketNumber: '101-20', pk: 'in', sk: 'the shed', workItemId: 'abc' },
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
      docketNumber: '101-20',
      trialDate,
      workItemId: 'abc',
    });
    expect(
      applicationContext.getPersistenceGateway().updateWorkItemTrialDate.mock
        .calls[1][0],
    ).toMatchObject({
      applicationContext,
      docketNumber: '101-20',
      trialDate,
      workItemId: 'abc',
    });
  });
});
