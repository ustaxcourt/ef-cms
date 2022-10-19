import { update } from '../../dynamodbClientService';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { updateWorkItemDocketNumberSuffix } from './updateWorkItemDocketNumberSuffix';

jest.mock('../../dynamodbClientService', () => ({
  update: jest.fn(),
}));

describe('updateWorkItemDocketNumberSuffix', () => {
  it('should call client.update with passed in docket number suffix and work item pk and sk', async () => {
    const mockDocketNumberSuffix = 'S';
    const mockPk = 'case|pk';
    const mockSk = 'work-item|sk';

    await updateWorkItemDocketNumberSuffix({
      applicationContext,
      docketNumber: 'pk',
      docketNumberSuffix: mockDocketNumberSuffix,
      workItemId: 'sk',
    });

    expect((update as jest.Mock).mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':docketNumberSuffix': mockDocketNumberSuffix,
      },
      Key: {
        pk: mockPk,
        sk: mockSk,
      },
    });
  });
});
