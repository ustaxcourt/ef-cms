import { update } from '../../dynamodbClientService';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { updateWorkItemTrialDate } from './updateWorkItemTrialDate';

jest.mock('../../dynamodbClientService', () => ({
  update: jest.fn(),
}));

describe('updateWorkItemTrialDate', () => {
  it('should call client.update with passed in trial date and work item pk and sk', async () => {
    const mockTrialDate = '2019-08-25T05:00:00.000Z';
    const mockPk = 'case|pk';
    const mockSk = 'work-item|sk';

    await updateWorkItemTrialDate({
      applicationContext,
      docketNumber: 'pk',
      trialDate: mockTrialDate,
      workItemId: 'sk',
    });

    expect((update as jest.Mock).mock.calls[0][0]).toMatchObject({
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
