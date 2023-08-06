import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getWorkItemsByDocketNumber } from './getWorkItemsByDocketNumber';
import { query } from '../../dynamodbClientService';
jest.mock('../../dynamodbClientService');

const queryMock = query as jest.Mock;

describe('getWorkItemsByDocketNumber', () => {
  it('should call client.query with pk of case|{docketNumber}', async () => {
    const mockDocketNumber = '101-21';

    await getWorkItemsByDocketNumber({
      applicationContext,
      docketNumber: mockDocketNumber,
    });

    expect(queryMock.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':pk': `case|${mockDocketNumber}`,
        ':prefix': 'work-item',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    });
  });
});
