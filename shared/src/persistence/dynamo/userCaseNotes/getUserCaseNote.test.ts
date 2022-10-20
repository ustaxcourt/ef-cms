import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { getUserCaseNote } from './getUserCaseNote';

const USER_ID = '220b5dc9-9d0c-4662-97ad-2cb9729c611a';

jest.mock('../../dynamodbClientService', () => ({
  get: jest.fn().mockReturnValue({
    notes: 'something',
    pk: `user-case-note|${MOCK_CASE.docketNumber}`,
    sk: `user|${USER_ID}`,
    userId: USER_ID,
  }),
}));

describe('getUserCaseNote', () => {
  it('should get the case notes by case id and user id', async () => {
    const result = await getUserCaseNote({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      userId: USER_ID,
    });

    expect(result).toEqual({
      notes: 'something',
      pk: `user-case-note|${MOCK_CASE.docketNumber}`,
      sk: `user|${USER_ID}`,
      userId: USER_ID,
    });
  });
});
