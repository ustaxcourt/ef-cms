import { AccountConfirmationRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { get } from '../../dynamodbClientService';
import { getAccountConfirmationCode } from '@web-api/persistence/dynamo/users/getAccountConfirmationCode';

jest.mock('../../dynamodbClientService');

describe('getAccountConfirmationCode', () => {
  const realDate = Date.now.bind(global.Date);
  const mockDate = 1700000000000;
  const dayInSeconds = 86400;
  const expectedTtl = mockDate / 1000 + dayInSeconds;
  const mockConfirmationCode = '2b52c605-edba-41d7-b045-d5f992a499d3';
  const mockUserId = '0e411b80-9fac-4b03-9a1b-b44ea6b3109e';

  beforeAll(() => {
    const dateNowStub = jest.fn().mockReturnValue(mockDate);
    global.Date.now = dateNowStub;
  });

  afterAll(() => {
    global.Date.now = realDate;
  });

  it('should return confirmation code when it hasn`t expired yet', async () => {
    const mockConfirmationRecord: AccountConfirmationRecord = {
      confirmationCode: mockConfirmationCode,
      pk: `user|${mockUserId}`,
      sk: 'account-confirmation-code',
      ttl: expectedTtl,
      userId: mockUserId,
    };
    (get as jest.Mock).mockResolvedValue(mockConfirmationRecord);

    const result = await getAccountConfirmationCode(applicationContext, {
      userId: mockUserId,
    });

    expect(result).toEqual(mockConfirmationCode);
  });

  it('should NOT return confirmation code when it has expired', async () => {
    const expiredTtl = mockDate / 1000 - dayInSeconds;
    const mockConfirmationRecord: AccountConfirmationRecord = {
      confirmationCode: mockConfirmationCode,
      pk: `user|${mockUserId}`,
      sk: 'account-confirmation-code',
      ttl: expiredTtl,
      userId: mockUserId,
    };
    (get as jest.Mock).mockResolvedValue(mockConfirmationRecord);

    const result = await getAccountConfirmationCode(applicationContext, {
      userId: mockUserId,
    });

    expect(result).toBeUndefined();
  });
});
