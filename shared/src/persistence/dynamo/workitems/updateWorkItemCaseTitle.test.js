const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateWorkItemCaseTitle } = require('./updateWorkItemCaseTitle');

describe('updateWorkItemCaseTitle', () => {
  beforeEach(() => {
    client.update = jest.fn();
  });

  it('should call client.update with passed in case title and work item pk and sk', async () => {
    const mockCaseTitle = 'An Updated Title';
    const mockPk = 'work-item|pk';
    const mockSk = 'work-item|sk';

    await updateWorkItemCaseTitle({
      applicationContext,
      caseTitle: mockCaseTitle,
      workItem: {
        pk: mockPk,
        sk: mockSk,
      },
    });

    expect(client.update.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':caseTitle': mockCaseTitle,
      },
      Key: {
        pk: mockPk,
        sk: mockSk,
      },
    });
  });
});
