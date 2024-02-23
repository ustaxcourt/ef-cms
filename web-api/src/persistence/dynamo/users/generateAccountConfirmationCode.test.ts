import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateAccountConfirmationCode } from '@web-api/persistence/dynamo/users/generateAccountConfirmationCode';

describe('generateAccountConfirmationCode', () => {
  const realDate = Date.now.bind(global.Date);
  const mockDate = 1700000000000;
  const dayInSeconds = 86400;
  const expectedTtl = mockDate / 1000 + dayInSeconds;
  const mockConfirmationCode = '2b52c605-edba-41d7-b045-d5f992a499d3';
  const mockUserId = '0e411b80-9fac-4b03-9a1b-b44ea6b3109e';

  beforeAll(() => {
    const dateNowStub = jest.fn().mockReturnValue(mockDate);
    global.Date.now = dateNowStub;
    applicationContext.getUniqueId.mockReturnValue(mockConfirmationCode);
    applicationContext.getDocumentClient().put.mockResolvedValue(null);
  });

  afterAll(() => {
    global.Date.now = realDate;
  });

  it('should create a confirmation code, persist it with a ttl of one day, and return that confirmation code', async () => {
    const result = await generateAccountConfirmationCode(applicationContext, {
      userId: mockUserId,
    });

    expect(applicationContext.getUniqueId).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        confirmationCode: mockConfirmationCode,
        pk: `user|${mockUserId}`,
        sk: 'account-confirmation-code',
        ttl: expectedTtl,
        userId: mockUserId,
      },
    });

    expect(result).toEqual({ confirmationCode: mockConfirmationCode });
  });
});
