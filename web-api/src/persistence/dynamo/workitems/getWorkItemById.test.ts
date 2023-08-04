import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getWorkItemById } from './getWorkItemById';
import { query } from '../../dynamodbClientService';

jest.mock('../../dynamodbClientService');
const queryMock = query as jest.Mock;

describe('getWorkItemById', () => {
  beforeEach(() => {
    queryMock.mockReturnValue([
      {
        gsi1pk: 'work-item|abc',
        pk: 'case|abc',
        sk: 'work-item|abc',
        workItemId: 'abc',
      },
      {
        gsi1pk: 'work-item|abc',
        pk: 'section-outbox|abc',
        sk: 'work-item|abc',
        workItemId: 'abc',
      },
    ]);
  });

  it('returns the result from query that has a pk starting with case|', async () => {
    const result = await getWorkItemById({
      applicationContext,
      workItemId: 'abc',
    });
    expect(result).toEqual({
      gsi1pk: 'work-item|abc',
      pk: 'case|abc',
      sk: 'work-item|abc',
      workItemId: 'abc',
    });
  });
});
