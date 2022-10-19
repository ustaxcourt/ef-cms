import { update } from '../../dynamodbClientService';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { updateWorkItemAssociatedJudge } from './updateWorkItemAssociatedJudge';

jest.mock('../../dynamodbClientService', () => ({
  update: jest.fn(),
}));

describe('updateWorkItemAssociatedJudge', () => {
  it('should call client.update with passed in associated judge and work item pk and sk', async () => {
    const mockAssociatedJudge = 'Judge Cat';
    const mockPk = 'case|pk';
    const mockSk = 'work-item|sk';

    await updateWorkItemAssociatedJudge({
      applicationContext,
      associatedJudge: mockAssociatedJudge,
      docketNumber: 'pk',
      workItemId: 'sk',
    });

    expect((update as jest.Mock).mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':associatedJudge': mockAssociatedJudge,
      },
      Key: {
        pk: mockPk,
        sk: mockSk,
      },
    });
  });
});
