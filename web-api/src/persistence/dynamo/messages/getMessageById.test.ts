import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { get } from '../../dynamodbClientService';
import { getMessageById } from './getMessageById';

const mockDocketNumber = '101-20';
const mockMessageId = '445e9644-1f8f-4778-9582-6eafc15f1de4';

jest.mock('../../dynamodbClientService', () => ({
  get: jest.fn().mockReturnValue({
    docketNumber: '101-20',
    messageId: '445e9644-1f8f-4778-9582-6eafc15f1de4',
  }),
}));

describe('getMessageById', () => {
  it('should return the message retrieved from persistence using docket number and message id', async () => {
    const returnedMessage = await getMessageById({
      applicationContext,
      docketNumber: mockDocketNumber,
      messageId: mockMessageId,
    });

    expect((get as jest.Mock).mock.calls[0][0]).toMatchObject({
      Key: {
        pk: `case|${mockDocketNumber}`,
        sk: `message|${mockMessageId}`,
      },
    });

    expect(returnedMessage).toEqual({
      docketNumber: '101-20',
      messageId: '445e9644-1f8f-4778-9582-6eafc15f1de4',
    });
  });
});
