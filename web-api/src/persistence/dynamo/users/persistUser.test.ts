import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { persistUser } from './persistUser';

describe('persistUser', () => {
  it('attempts to persist the user record', async () => {
    const USER_ID = 'a58aedeb-fad5-4fc8-bda7-6f98ee453d19';

    await persistUser({
      applicationContext,
      user: {
        name: 'Someone',
        userId: USER_ID,
      } as any,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        name: 'Someone',
        pk: `user|${USER_ID}`,
        sk: `user|${USER_ID}`,
      },
    });
  });
});
