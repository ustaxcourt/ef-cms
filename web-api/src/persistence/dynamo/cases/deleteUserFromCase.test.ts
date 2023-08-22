import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteUserFromCase } from './deleteUserFromCase';

describe('deleteUserFromCase', () => {
  it('attempts to delete the user from the case', async () => {
    await deleteUserFromCase({
      applicationContext,
      docketNumber: '101-20',
      userId: '123',
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: 'user|123',
        sk: 'case|101-20',
      },
    });
  });
});
