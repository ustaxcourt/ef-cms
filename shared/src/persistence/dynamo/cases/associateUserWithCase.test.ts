import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { associateUserWithCase } from './associateUserWithCase';

describe('associateUserWithCase', () => {
  it('should persist the mapping record to associate user with case', async () => {
    const result = await associateUserWithCase({
      applicationContext,
      docketNumber: '123-20',
      userId: '123',
      userCase: {} as any,
    });
    expect(result).toEqual({
      gsi1pk: 'user-case|123-20',
      pk: 'user|123',
      sk: 'case|123-20',
    });
  });
});
