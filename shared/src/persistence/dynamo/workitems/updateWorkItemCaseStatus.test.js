const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../../business/entities/EntityConstants');
const { updateWorkItemCaseStatus } = require('./updateWorkItemCaseStatus');

describe('updateWorkItemCaseStatus', () => {
  beforeEach(() => {
    client.update = jest.fn();
  });

  it('should call client.update with passed in case status and work item pk and sk', async () => {
    const mockCaseStatus = CASE_STATUS_TYPES.generalDocket;
    const mockPk = 'work-item|pk';
    const mockSk = 'work-item|sk';

    await updateWorkItemCaseStatus({
      applicationContext,
      caseStatus: mockCaseStatus,
      workItem: {
        pk: mockPk,
        sk: mockSk,
      },
    });

    expect(client.update.mock.calls[0][0]).toMatchObject({
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
