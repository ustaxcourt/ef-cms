import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { put } from '../../dynamodbClientService';
import { updateUserCaseNote } from './updateUserCaseNote';

jest.mock('../../dynamodbClientService', () => ({
  put: jest.fn(),
}));

describe('updateUserCaseNote', () => {
  const USER_ID = '42f68c70-b803-4883-985d-ea1903e31ae2';

  it('invokes the persistence layer with pk of user-case-note|{docketNumber}, sk of {userId} and other expected params', async () => {
    await updateUserCaseNote({
      applicationContext,
      caseNoteToUpdate: {
        docketNumber: MOCK_CASE.docketNumber,
        notes: 'something!!!',
        userId: USER_ID,
      },
    });

    expect((put as jest.Mock).mock.calls[0][0]).toMatchObject({
      Item: {
        notes: 'something!!!',
        pk: `user-case-note|${MOCK_CASE.docketNumber}`,
        sk: `user|${USER_ID}`,
      },
    });
  });
});
