import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { query } from '../../dynamodbClientService';
import { verifyPendingCaseForUser } from './verifyPendingCaseForUser';

jest.mock('../../dynamodbClientService');

const queryMock = query as jest.Mock;

const userId = '123';
const docketNumber = '123-20';

describe('verifyPendingCaseForUser', () => {
  it('should return true if mapping record for user to case exists', async () => {
    queryMock.mockReturnValue([
      {
        pk: 'user|123',
        sk: 'pending-case|123-20',
      },
    ]);
    const result = await verifyPendingCaseForUser({
      applicationContext,
      docketNumber,
      userId,
    });
    expect(result).toEqual(true);
  });

  it('should return false if mapping record for user to case does not exist', async () => {
    queryMock.mockReturnValue([]);
    const result = await verifyPendingCaseForUser({
      applicationContext,
      docketNumber,
      userId,
    });
    expect(result).toEqual(false);
  });
});
