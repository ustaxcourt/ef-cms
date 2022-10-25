import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { update } from '../../dynamodbClientService';
import { updateWorkItemCaseTitle } from './updateWorkItemCaseTitle';

jest.mock('../../dynamodbClientService', () => ({
  update: jest.fn(),
}));

describe('updateWorkItemCaseTitle', () => {
  it('should call client.update with passed in case title and work item pk and sk', async () => {
    const mockCaseTitle = 'An Updated Title';

    await updateWorkItemCaseTitle({
      applicationContext,
      caseTitle: mockCaseTitle,
      docketNumber: '101-20',
      workItemId: '123',
    });

    expect((update as jest.Mock).mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':caseTitle': mockCaseTitle,
      },
      Key: {
        pk: 'case|101-20',
        sk: 'work-item|123',
      },
    });
  });
});
