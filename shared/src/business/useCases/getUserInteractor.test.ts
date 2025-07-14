import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import { PETITIONS_SECTION, ROLES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { getUserInteractor } from './getUserInteractor';
import {
  mockIrsPractitionerUser,
  mockJudgeUser,
  mockPetitionsClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';

import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { RawUser } from '../entities/User';

const getUserById = jest.mocked(getUserByIdMock);

describe('getUserInteractor', () => {
  it('should call the persistence method to get the user', async () => {
    getUserById.mockResolvedValue({
      ...mockPetitionsClerkUser,
      section: PETITIONS_SECTION,
    });

    const user = await getUserInteractor(
      applicationContext,
      mockPetitionsClerkUser,
    );

    expect(user).toEqual({
      ...mockPetitionsClerkUser,
      section: PETITIONS_SECTION,
    });
  });

  it('should throw an error if the user is not found', async () => {
    getUserById.mockResolvedValue(undefined);

    await expect(
      getUserInteractor(applicationContext, mockPetitionsClerkUser),
    ).rejects.toThrow(
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
    } as RawUser);

    const user = await getUserInteractor(applicationContext, mockJudgeUser);

    expect(user).toMatchObject({
      ...mockJudge,
      section: 'judge',
    });
  });

  it('should return a PrivatePractitioner entity when the entity returned from persistence is a PrivatePractitioner', async () => {
    getUserById.mockResolvedValue({
      ...mockPrivatePractitionerUser,
      barNumber: 'PT1234',
    });

    const user = await getUserInteractor(
      applicationContext,
      mockPrivatePractitionerUser,
    );

    expect(user).toEqual({
      ...mockPrivatePractitionerUser,
      barNumber: 'PT1234',
      representing: [],
    });
  });

  it('should return an IrsPractitioner entity when the entity returned from persistence is a IrsPractitioner', async () => {
    getUserById.mockResolvedValue({
      ...mockIrsPractitionerUser,
      barNumber: 'PT5678',
    });

    const user = await getUserInteractor(
      applicationContext,
      mockIrsPractitionerUser,
    );

    expect(user).toEqual({
      ...mockIrsPractitionerUser,
      barNumber: 'PT5678',
      isUpdatingInformation: undefined,
      token: undefined,
    });
  });

  it('should return a Practitioner entity when the entity returned from persistence is a Practitioner', async () => {
    const mockPractitioner = {
      admissionsDate: '2019-03-01',
      admissionsStatus: 'Active',
      birthYear: '1976',
      firstName: 'Bob',
      lastName: 'Ross',
      name: 'Bob Ross',
      originalBarState: 'IL',
      practiceType: 'IRS',
      practitionerType: 'Attorney',
      role: ROLES.irsPractitioner,
      userId: mockIrsPractitionerUser.userId,
    };
    getUserById.mockResolvedValue({
      ...mockPractitioner,
      barNumber: 'PT9012',
    });

    const user = await getUserInteractor(
      applicationContext,
      mockIrsPractitionerUser,
    );

    expect(user).toEqual({
      ...mockPractitioner,
      barNumber: 'PT9012',
      email: undefined,
      isUpdatingInformation: undefined,
      token: undefined,
    });
  });
});
