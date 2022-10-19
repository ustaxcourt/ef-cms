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

    await updateWorkItemCaseTitle({
      applicationContext,
      caseTitle: mockCaseTitle,
      docketNumber: '101-20',
      workItemId: '123',
    });

    expect(client.update.mock.calls[0][0]).toMatchObject({
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
