import '@web-api/persistence/postgres/users/mocks.jest';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import {
  PETITIONS_SECTION,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { getUserInteractor } from './getUserInteractor';
import {
  mockIrsPractitionerUser,
  mockJudgeUser,
  mockPetitionsClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';

const getUserById = getUserByIdMock as jest.Mock;

describe('getUserInteractor', () => {
  it('should call the persistence method to get the user', async () => {
    getUserById.mockReturnValue({
      ...mockPetitionsClerkUser,
      entityName: 'User',
      section: PETITIONS_SECTION,
    });

    const user = await getUserInteractor(mockPetitionsClerkUser);

    expect(user).toEqual({
      ...mockPetitionsClerkUser,
      barNumber: undefined,
      entityName: 'User',
      section: PETITIONS_SECTION,
      token: undefined,
    });
  });

  it('should throw an error if the user is not found', async () => {
    getUserById.mockReturnValue(null);

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
    getUserById.mockReturnValue({
      ...mockJudge,
      entityName: 'User',
      section: 'judge',
    });

    const user = await getUserInteractor(mockJudgeUser);

    expect(user).toEqual({
      ...mockJudge,
      barNumber: undefined,
      email: undefined,
      entityName: 'User',
      section: 'judge',
      token: undefined,
    });
  });

  it('should return a PrivatePractitioner entity when the entity returned from persistence is a PrivatePractitioner', async () => {
    getUserById.mockReturnValue({
      ...mockPrivatePractitionerUser,
      barNumber: 'PT1234',
      entityName: PrivatePractitioner.ENTITY_NAME,
      representing: [],
    });

    const user = await getUserInteractor(mockPrivatePractitionerUser);

    expect(user).toMatchObject({
      ...mockPrivatePractitionerUser,
      barNumber: 'PT1234',
      entityName: PrivatePractitioner.ENTITY_NAME,
      representing: [],
    });
    expect(user.isUpdatingInformation).toBeUndefined();
    expect(user.token).toBeUndefined();
  });

  it('should return an IrsPractitioner entity when the entity returned from persistence is a IrsPractitioner', async () => {
    getUserById.mockReturnValue({
      ...mockIrsPractitionerUser,
      barNumber: 'PT5678',
      entityName: IrsPractitioner.ENTITY_NAME,
    });

    const user = await getUserInteractor(mockIrsPractitionerUser);

    expect(user).toMatchObject({
      ...mockIrsPractitionerUser,
      barNumber: 'PT5678',
    });
    expect(user.isUpdatingInformation).toBeUndefined();
    expect(user.token).toBeUndefined();
  });

  it('should return a Practitioner entity when the entity returned from persistence is a Practitioner', async () => {
    const mockPractitioner = {
      admissionsDate: '2019-03-01',
      admissionsStatus: 'Active',
      birthYear: '1976',
      entityName: Practitioner.ENTITY_NAME,
      firstName: 'Bob',
      lastName: 'Ross',
      name: 'Bob Ross',
      originalBarState: 'IL',
      practiceType: 'IRS',
      practitionerType: 'Attorney',
      role: ROLES.irsPractitioner,
      userId: mockIrsPractitionerUser.userId,
    };
    getUserById.mockReturnValue({
      ...mockPractitioner,
      barNumber: 'PT9012',
    });

    const user = await getUserInteractor(mockIrsPractitionerUser);

    expect(user).toMatchObject({
      ...mockPractitioner,
      barNumber: 'PT9012',
    });
    expect(user.email).toBeUndefined();
    expect(user.isUpdatingInformation).toBeUndefined();
    expect(user.token).toBeUndefined();
  });
});
