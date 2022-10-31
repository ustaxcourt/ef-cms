import { CASE_STATUS_TYPES } from '../../../business/entities/EntityConstants';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { update } from '../../dynamodbClientService';
import { updateWorkItemCaseStatus } from './updateWorkItemCaseStatus';

jest.mock('../../dynamodbClientService', () => ({
  update: jest.fn(),
}));
describe('updateWorkItemCaseStatus', () => {
  it('should call client.update with passed in case status and work item pk and sk', async () => {
    const mockCaseStatus = CASE_STATUS_TYPES.generalDocket;
    const mockPk = 'case|pk';
    const mockSk = 'work-item|sk';

    await updateWorkItemCaseStatus({
      applicationContext,
      caseStatus: mockCaseStatus,
      docketNumber: 'pk',
      workItemId: 'sk',
    });

    expect((update as jest.Mock).mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':caseStatus': mockCaseStatus,
      },
      Key: {
        pk: mockPk,
        sk: mockSk,
      },
    });
  });
});
