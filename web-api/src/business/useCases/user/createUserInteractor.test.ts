import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { UnauthorizedError } from '@web-api/errors/errors';
import { adminUser, petitionerUser } from '@shared/test/mockUsers';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createUserInteractor } from './createUserInteractor';

describe('createUserInteractor', () => {
  it('should throw an unauthorized error when the current user does NOT have an "admin" role', async () => {
    const mockUser = {
      name: 'Test Petitioner',
      role: ROLES.petitioner,
      userId: '615b7d39-8fae-4c2f-893c-3c829598bc71',
    };
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);
    applicationContext
      .getPersistenceGateway()
      .createOrUpdateUser.mockReturnValue(mockUser);

    await expect(
      createUserInteractor(applicationContext, {
        user: {
          entityName: 'User',
          name: 'Test Petitioner',
          password: 'P@ssw0rd',
          role: ROLES.petitioner,
        } as RawUser,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should create a practitioner user when the user role is privatePractitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue(adminUser);
    applicationContext.getPersistenceGateway().createUser.mockReturnValue({
      barNumber: 'CS20001',
      name: 'Test PrivatePractitioner',
      role: ROLES.privatePractitioner,
      userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
    });

    const user = await createUserInteractor(applicationContext, {
      user: {
        admissionsDate: '2020-03-14',
        admissionsStatus: 'Active',
        birthYear: '1993',
        employer: 'Private',
        entityName: 'Practitioner',
        firstName: 'Test',
        lastName: 'PrivatePractitioner',
        name: 'Test PrivatePractitioner',
        originalBarState: 'CA',
        password: 'P@ssw0rd',
        practitionerType: 'Attorney',
        role: ROLES.privatePractitioner,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
    });

    expect(user).toMatchObject({
      barNumber: 'CS20001',
      role: ROLES.privatePractitioner,
    });
  });

  it('should create a practitioner user when the user role is irsPractitioner', async () => {
    const mockAdmissionsDate = '1876-02-19';
    applicationContext.getCurrentUser.mockReturnValue(adminUser);
    applicationContext
      .getPersistenceGateway()
      .createOrUpdateUser.mockReturnValue({
        barNumber: 'CS20001',
        name: 'Test IrsPractitioner',
        role: ROLES.irsPractitioner,
        userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
      });

    const user = await createUserInteractor(applicationContext, {
      user: {
        admissionsDate: mockAdmissionsDate,
        admissionsStatus: 'Active',
        birthYear: '1993',
        employer: 'DOJ',
        entityName: 'Practitioner',
        firstName: 'Test',
        lastName: 'IRSPractitioner',
        name: 'Test IRS Practitioner',
        originalBarState: 'CA',
        password: 'P@ssw0rd',
        practitionerType: 'Attorney',
        role: ROLES.irsPractitioner,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      },
    });

    expect(user).toMatchObject({
      barNumber: 'CS20001',
      role: ROLES.irsPractitioner,
    });
  });

  it('should create a practitioner user when the user role is inactivePractitioner', async () => {
    const mockAdmissionsDate = '1876-02-19';
    applicationContext.getCurrentUser.mockReturnValue(adminUser);
    applicationContext
      .getPersistenceGateway()
      .createOrUpdateUser.mockReturnValue({
        barNumber: 'CS20001',
        name: 'Test InactivePractitioner',
        role: ROLES.inactivePractitioner,
        userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
      });

    const user = await createUserInteractor(applicationContext, {
      user: {
        admissionsDate: mockAdmissionsDate,
        admissionsStatus: 'Inactive',
        birthYear: '1993',
        employer: 'DOJ',
        entityName: 'Practitioner',
        firstName: 'Test',
        lastName: 'InactivePractitioner',
        name: 'Test Inactive Practitioner',
        originalBarState: 'CA',
        password: 'P@ssw0rd',
        practitionerType: 'Attorney',
        role: ROLES.inactivePractitioner,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
    });

    expect(user).toMatchObject({
      barNumber: 'CS20001',
      role: ROLES.inactivePractitioner,
    });
  });

  it('should create a generic user and delete the barNumber when it is defined and the user is not a pracititoner', async () => {
    applicationContext.getCurrentUser.mockReturnValue(adminUser);
    applicationContext
      .getPersistenceGateway()
      .createOrUpdateUser.mockReturnValue({
        barNumber: '',
        name: 'Test PrivatePractitioner',
        role: ROLES.judge,
        userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
      });

    const user = await createUserInteractor(applicationContext, {
      user: {
        barNumber: 'NOT_VALID',
        entityName: 'User',
        name: 'Test Petitioner',
        password: 'P@ssw0rd',
        role: ROLES.petitioner,
        userId: '9f797a9b-b596-488f-aa31-eca147b9b18d',
      },
    });

    expect(user).toMatchObject({
      role: ROLES.petitioner,
    });
  });

  it('should create a legacyJudge user and disable the user', async () => {
    const mockUser = {
      email: 'test@example.com',
      name: 'Test Legacy Judge',
      role: ROLES.legacyJudge,
      userId: '845b7d39-8fae-4c2f-893c-3c829598bc71',
    };
    applicationContext.getCurrentUser.mockReturnValue(adminUser);
    applicationContext
      .getPersistenceGateway()
      .createOrUpdateUser.mockReturnValue(mockUser);

    await createUserInteractor(applicationContext, {
      user: {
        barNumber: 'LR1234',
        email: 'test@example.com',
        entityName: 'User',
        name: 'Jesse Pinkman',
        password: 'P@ssw0rd',
        role: ROLES.legacyJudge,
        userId: 'ce2bfd0f-f06c-4ff8-9ee3-1a385e3a8bef',
      },
    });

    expect(
      applicationContext.getUserGateway().disableUser,
    ).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        email: mockUser.email,
      }),
    );
  });
});
