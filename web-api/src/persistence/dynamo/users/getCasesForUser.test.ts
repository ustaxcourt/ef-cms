import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getDocketNumbersByUser } from '@web-api/persistence/dynamo/users/getCasesForUser';
import { queryFull } from '../../dynamodbClientService';

jest.mock('../../dynamodbClientService');

describe('getDocketNumbersByUser', () => {
  beforeEach(() => {
    (queryFull as jest.Mock).mockReturnValueOnce([
      {
        pk: 'user|455de2eb-77b2-4815-aa2b-99475b2f68bb',
        sk: 'case|123-20',
      },
      {
        pk: 'user|455de2eb-77b2-4815-aa2b-99475b2f68bb',
        sk: 'case|124-20',
      },
    ]);
  });

  it('should return docket numbers from persistence', async () => {
    const result = await getDocketNumbersByUser({
      applicationContext,
      userId: 'abc',
    });

    expect(result).toEqual(['123-20', '124-20']);
  });
});
