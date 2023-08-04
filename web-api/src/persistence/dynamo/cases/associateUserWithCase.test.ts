import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { associateUserWithCase } from './associateUserWithCase';

describe('associateUserWithCase', () => {
  it('should persist the mapping record to associate user with case', async () => {
    const result = await associateUserWithCase({
      applicationContext,
      docketNumber: '123-20',
      userCase: {} as any,
      userId: '123',
    });
    expect(result).toEqual({
      gsi1pk: 'user-case|123-20',
      pk: 'user|123',
      sk: 'case|123-20',
    });
  });
});
