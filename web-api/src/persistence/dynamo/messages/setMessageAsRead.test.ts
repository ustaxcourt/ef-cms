import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { setMessageAsRead } from './setMessageAsRead';

describe('setMessageAsRead', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().update.mockReturnValue({
      promise: () => Promise.resolve(true),
    });
  });

  it('invokes the persistence for setting a message as read', async () => {
    await setMessageAsRead({
      applicationContext,
      docketNumber: '123-45',
      messageId: '15adf875-8c3c-4e94-91e9-a4c1bff51291',
    });

    expect(
      applicationContext.getDocumentClient().update.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: 'case|123-45',
        sk: 'message|15adf875-8c3c-4e94-91e9-a4c1bff51291',
      },
    });
  });
});
