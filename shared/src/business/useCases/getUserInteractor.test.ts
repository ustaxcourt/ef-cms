import { IrsPractitioner } from '../entities/IrsPractitioner';
import { PETITIONS_SECTION, ROLES } from '../entities/EntityConstants';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { User } from '../entities/User';
import { applicationContext } from '../test/createTestApplicationContext';
import { getUserInteractor } from './getUserInteractor';

describe('getUserInteractor', () => {
  it('should call the persistence method to get the user', async () => {
    const mockPetitionsClerk = {
      name: 'Test Petitionsclerk',
      role: ROLES.petitionsClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    };
    applicationContext.getCurrentUser.mockReturnValue(
      new User(mockPetitionsClerk),
    );
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockPetitionsClerk,
      section: PETITIONS_SECTION,
    });

    const user = await getUserInteractor(applicationContext);

    expect(user).toEqual({
      ...mockPetitionsClerk,
      barNumber: undefined,
      email: undefined,
      entityName: 'User',
      section: PETITIONS_SECTION,
      token: undefined,
    });
  });

  it('should throw an error if the user is not found', async () => {
    const mockPetitionsClerk = {
      name: 'Test Petitionsclerk',
      role: ROLES.petitionsClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    };
    applicationContext.getCurrentUser.mockReturnValue(
      new User(mockPetitionsClerk),
    );
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(null);

    await expect(getUserInteractor(applicationContext)).rejects.toThrow(
      `User id "${mockPetitionsClerk.userId}" not found in persistence.`,
    );
  });

  it('should call the persistence method to get the user when the user is a judge', async () => {
    const mockJudge = {
      isSeniorJudge: false,
      judgeFullName: 'Test Judge',
      judgeTitle: 'Judge',
      name: 'Test Judge',
      role: ROLES.judge,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    };
    applicationContext.getCurrentUser.mockReturnValue(new User(mockJudge));
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockJudge,
      section: 'judge',
    });

    const user = await getUserInteractor(applicationContext);

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
    const mockPrivatePractitioner = {
      entityName: PrivatePractitioner.ENTITY_NAME,
      name: 'Test Private Practitioner',
      role: ROLES.privatePractitioner,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    };

    applicationContext.getCurrentUser.mockReturnValue(
      new User(mockPrivatePractitioner),
    );
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockPrivatePractitioner,
      barNumber: 'PT1234',
    });

    const user = await getUserInteractor(applicationContext);

    expect(user).toMatchObject({
      ...mockPrivatePractitioner,
      barNumber: 'PT1234',
      email: undefined,
      isUpdatingInformation: undefined,
      representing: [],
      token: undefined,
    });
  });

  it('should return an IrsPractitioner entity when the entity returned from persistence is a IrsPractitioner', async () => {
    const mockIrsPractitioner = {
      entityName: IrsPractitioner.ENTITY_NAME,
      name: 'Test Irs Practitioner',
      role: ROLES.irsPractitioner,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    };

    applicationContext.getCurrentUser.mockReturnValue(
      new User(mockIrsPractitioner),
    );
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockIrsPractitioner,
      barNumber: 'PT5678',
    });

    const user = await getUserInteractor(applicationContext);

    expect(user).toMatchObject({
      ...mockIrsPractitioner,
      barNumber: 'PT5678',
      email: undefined,
      isUpdatingInformation: undefined,
      token: undefined,
    });
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
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    };

    applicationContext.getCurrentUser.mockReturnValue(
      new User(mockPractitioner),
    );
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockPractitioner,
      barNumber: 'PT9012',
    });

    const user = await getUserInteractor(applicationContext);

    expect(user).toMatchObject({
      ...mockPractitioner,
      barNumber: 'PT9012',
      email: undefined,
      isUpdatingInformation: undefined,
      token: undefined,
    });
  });
});
