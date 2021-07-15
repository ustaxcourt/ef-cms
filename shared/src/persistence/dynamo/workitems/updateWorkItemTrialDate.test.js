const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateWorkItemTrialDate } = require('./updateWorkItemTrialDate');

describe('updateWorkItemTrialDate', () => {
  beforeEach(() => {
    client.update = jest.fn();
  });

  it('should call client.update with passed in trial date and work item pk and sk', async () => {
    const mockTrialDate = '2019-08-25T05:00:00.000Z';
    const mockPk = 'work-item|pk';
    const mockSk = 'work-item|sk';

    await updateWorkItemTrialDate({
      applicationContext,
      trialDate: mockTrialDate,
      workItem: {
        pk: mockPk,
        sk: mockSk,
      },
    });

    expect(client.update.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':trialDate': mockTrialDate,
      },
      Key: {
        pk: mockPk,
        sk: mockSk,
      },
    });
  });
});
