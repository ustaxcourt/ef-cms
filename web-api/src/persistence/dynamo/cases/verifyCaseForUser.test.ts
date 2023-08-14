import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { query } from '../../dynamodbClientService';
import { verifyCaseForUser } from './verifyCaseForUser';

jest.mock('../../dynamodbClientService');

const userId = '123';
const docketNumber = '123-20';

const queryMock = query as jest.Mock;

describe('verifyCaseForUser', () => {
  it('should return true if mapping record for user to case exists', async () => {
    queryMock.mockReturnValue([
      {
        pk: 'user|123',
        sk: 'case|123-20',
      },
    ]);
    const result = await verifyCaseForUser({
      applicationContext,
      docketNumber,
      userId,
    });
    expect(result).toEqual(true);
  });
  it('should return false if mapping record for user to case does not exist', async () => {
    queryMock.mockReturnValue([]);
    const result = await verifyCaseForUser({
      applicationContext,
      docketNumber,
      userId,
    });
    expect(result).toEqual(false);
  });
});
