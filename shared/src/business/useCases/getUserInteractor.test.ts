import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import { PETITIONS_SECTION, ROLES } from '../entities/EntityConstants';
import { getUserInteractor } from './getUserInteractor';
import {
  mockJudgeUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

const getUserById = jest.mocked(getUserByIdMock);

describe('getUserInteractor', () => {
  it('should call the persistence method to get the user', async () => {
    getUserById.mockResolvedValue({
      ...mockPetitionsClerkUser,
      section: PETITIONS_SECTION,
    } as DbUser);

    const user = await getUserInteractor(mockPetitionsClerkUser);

    expect(user).toEqual({
      ...mockPetitionsClerkUser,
      section: PETITIONS_SECTION,
    });
  });

  it('should throw an error if the user is not found', async () => {
    getUserById.mockResolvedValue(undefined);

    await expect(getUserInteractor(mockPetitionsClerkUser)).rejects.toThrow(
      `User id "${mockPetitionsClerkUser.userId}" not found in persistence.`,
    );
  });

  it('should call the persistence method to get the user when the user is a judge', async () => {
    const mockJudge = {
      isSeniorJudge: false,
      judgeFullName: 'Test Judge',
      judgeTitle: 'Judge',
      name: 'Test Judge',
      role: ROLES.judge,
      userId: mockJudgeUser.userId,
    };
    getUserById.mockResolvedValue({
      ...mockJudge,
      section: 'judge',
    } as DbUser);

    const user = await getUserInteractor(mockJudgeUser);

    expect(user).toMatchObject({
      ...mockJudge,
      section: 'judge',
    });
  });
});
