import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { PETITIONS_SECTION, ROLES } from '../entities/EntityConstants';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { applicationContext } from '../test/createTestApplicationContext';
import { getUserInteractor } from './getUserInteractor';
import {
  mockIrsPractitionerUser,
  mockJudgeUser,
  mockPetitionsClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';

describe('getUserInteractor', () => {
  it('should call the persistence method to get the user', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockPetitionsClerkUser,
      section: PETITIONS_SECTION,
    });

    const user = await getUserInteractor(
      applicationContext,
      mockPetitionsClerkUser,
    );

    expect(user).toEqual({
      ...mockPetitionsClerkUser,
      barNumber: undefined,
      entityName: 'User',
      section: PETITIONS_SECTION,
      token: undefined,
    });
  });

  it('should throw an error if the user is not found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(null);

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
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockJudge,
      section: 'judge',
    });

    const user = await getUserInteractor(applicationContext, mockJudgeUser);

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
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockPrivatePractitionerUser,
      barNumber: 'PT1234',
      entityName: PrivatePractitioner.ENTITY_NAME,
    });

    const user = await getUserInteractor(
      applicationContext,
      mockPrivatePractitionerUser,
    );

    expect(user).toMatchObject({
      ...mockPrivatePractitionerUser,
      barNumber: 'PT1234',
      isUpdatingInformation: undefined,
      representing: [],
      token: undefined,
    });
  });

  it('should return an IrsPractitioner entity when the entity returned from persistence is a IrsPractitioner', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockIrsPractitionerUser,
      barNumber: 'PT5678',
      entityName: IrsPractitioner.ENTITY_NAME,
    });

    const user = await getUserInteractor(
      applicationContext,
      mockIrsPractitionerUser,
    );

    expect(user).toMatchObject({
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
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockPractitioner,
      barNumber: 'PT9012',
    });

    const user = await getUserInteractor(
      applicationContext,
      mockIrsPractitionerUser,
    );

    expect(user).toMatchObject({
      ...mockPractitioner,
      barNumber: 'PT9012',
      email: undefined,
      isUpdatingInformation: undefined,
      token: undefined,
    });
  });
});
