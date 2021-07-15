const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  updateWorkItemDocketNumberSuffix,
} = require('./updateWorkItemDocketNumberSuffix');

describe('updateWorkItemDocketNumberSuffix', () => {
  beforeEach(() => {
    client.update = jest.fn();
  });

  it('should call client.update with passed in docket number suffix and work item pk and sk', async () => {
    const mockDocketNumberSuffix = 'S';
    const mockPk = 'work-item|pk';
    const mockSk = 'work-item|sk';

    await updateWorkItemDocketNumberSuffix({
      applicationContext,
      docketNumberSuffix: mockDocketNumberSuffix,
      workItem: {
        pk: mockPk,
        sk: mockSk,
      },
    });

    expect(client.update.mock.calls[0][0]).toMatchObject({
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
