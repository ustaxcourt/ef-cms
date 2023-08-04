import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getUserCaseNoteForCases } from './getUserCaseNoteForCases';

const USER_ID = 'b1edae5a-23e4-4dc8-9d6c-43060ab3d8c7';

jest.mock('../../dynamodbClientService', () => ({
  batchGet: jest.fn().mockReturnValue([
    {
      notes: 'something',
      pk: `user-case-note|${MOCK_CASE.docketNumber}`,
      sk: `user|${USER_ID}`,
      userId: USER_ID,
    },
  ]),
}));

describe('getUserCaseNoteForCases', () => {
  it('should get the case notes by case id and user id', async () => {
    const result = await getUserCaseNoteForCases({
      applicationContext,
      docketNumbers: [MOCK_CASE.docketNumber],
      userId: USER_ID,
    });

    expect(result).toEqual([
      {
        notes: 'something',
        pk: `user-case-note|${MOCK_CASE.docketNumber}`,
        sk: `user|${USER_ID}`,
        userId: USER_ID,
      },
    ]);
  });
});
