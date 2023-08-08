import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteUserCaseNote } from './deleteUserCaseNote';
import { remove } from '../../dynamodbClientService';

jest.mock('../../dynamodbClientService', () => ({
  remove: jest.fn(),
}));

describe('deleteUserCaseNote', () => {
  const USER_ID = '10ecc428-ca35-4e36-aef2-e844660ce22d';

  it('attempts to delete the case note', async () => {
    await deleteUserCaseNote({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      userId: USER_ID,
    });

    expect((remove as jest.Mock).mock.calls[0][0]).toMatchObject({
      key: {
        pk: `user-case-note|${MOCK_CASE.docketNumber}`,
        sk: `user|${USER_ID}`,
      },
    });
  });
});
