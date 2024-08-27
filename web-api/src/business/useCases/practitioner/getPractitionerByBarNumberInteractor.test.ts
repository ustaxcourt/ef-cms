import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPractitionerByBarNumberInteractor } from './getPractitionerByBarNumberInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('getPractitionerByBarNumberInteractor', () => {
  describe('Logged in User', () => {
    it('throws an unauthorized error if the request user does not have the MANAGE_PRACTITIONER_USERS permissions', async () => {
      await expect(
        getPractitionerByBarNumberInteractor(
          applicationContext,
          {
            barNumber: 'BN0000',
          },
          mockPetitionerUser,
        ),
      ).rejects.toThrow('Unauthorized for getting attorney user');
    });

    it('calls the persistence method to get a private practitioner with the given bar number', async () => {
      applicationContext
        .getPersistenceGateway()
        .getPractitionerByBarNumber.mockReturnValue({
          admissionsDate: '2019-03-01',
          admissionsStatus: 'Active',
          barNumber: 'PP1234',
          birthYear: '1983',
          firmName: 'GW Law Offices',
          firstName: 'Private',
          lastName: 'Practitioner',

          name: 'Private Practitioner',
          originalBarState: 'IL',
          practiceType: 'Private',
          practitionerType: 'Attorney',
          role: ROLES.privatePractitioner,
          section: ROLES.privatePractitioner,

          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });

      const practitioner = await getPractitionerByBarNumberInteractor(
        applicationContext,
        {
          barNumber: 'PP1234',
        },
        mockPetitionsClerkUser,
      );

      expect(practitioner).toEqual({
        additionalPhone: undefined,
        admissionsDate: '2019-03-01',
        admissionsStatus: 'Active',
        barNumber: 'PP1234',
        birthYear: '1983',
        email: undefined,
        entityName: 'Practitioner',
        // we return all practitioner search results as a Practitioner user.
        firmName: 'GW Law Offices',

        firstName: 'Private',
        isUpdatingInformation: undefined,
        lastName: 'Practitioner',
        middleName: undefined,
        name: 'Private Practitioner',
        originalBarState: 'IL',
        practiceType: 'Private',
        practitionerType: 'Attorney',
        role: ROLES.privatePractitioner,
        section: ROLES.privatePractitioner,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        suffix: undefined,
        token: undefined,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    });

    it('calls the persistence method to get an IRS practitioner with the given bar number', async () => {
      applicationContext
        .getPersistenceGateway()
        .getPractitionerByBarNumber.mockReturnValue({
          admissionsDate: '2019-03-01',
          admissionsStatus: 'Active',
          barNumber: 'PI5678',
          birthYear: '1983',
          firmName: 'GW Law Offices',
          firstName: 'IRS',
          lastName: 'Practitioner',
          name: 'IRS Practitioner',
          originalBarState: 'IL',
          practiceType: 'Private',
          practitionerType: 'Attorney',
          role: ROLES.irsPractitioner,
          section: ROLES.privatePractitioner,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });

      const practitioner = await getPractitionerByBarNumberInteractor(
        applicationContext,
        {
          barNumber: 'PI5678',
        },
        mockPetitionsClerkUser,
      );

      expect(practitioner).toEqual({
        additionalPhone: undefined,
        admissionsDate: '2019-03-01',
        admissionsStatus: 'Active',
        barNumber: 'PI5678',
        birthYear: '1983',
        email: undefined,
        entityName: 'Practitioner',
        firmName: 'GW Law Offices',
        firstName: 'IRS',
        isUpdatingInformation: undefined,
        lastName: 'Practitioner',
        middleName: undefined,
        name: 'IRS Practitioner',
        originalBarState: 'IL',
        practiceType: 'Private',
        practitionerType: 'Attorney',
        role: ROLES.privatePractitioner,
        section: 'irsPractitioner',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        suffix: undefined,
        token: undefined,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    });

    it('throws a not found error if no practitioner is found with the given bar number', async () => {
      applicationContext
        .getPersistenceGateway()
        .getPractitionerByBarNumber.mockReturnValue(undefined);

      const practitioner = await getPractitionerByBarNumberInteractor(
        applicationContext,
        {
          barNumber: 'BN0000',
        },
        mockPetitionsClerkUser,
      );

      expect(practitioner).toBeUndefined();
    });
  });

  describe('Public User', () => {
    beforeEach(() => {
      applicationContext
        .getPersistenceGateway()
        .getPractitionerByBarNumber.mockReturnValue({
          admissionsDate: '2019-03-01',
          admissionsStatus: 'Active',
          barNumber: 'PP1234',
          birthYear: '1983',
          firmName: 'GW Law Offices',
          firstName: 'Private',
          lastName: 'Practitioner',
          name: 'Private Practitioner',
          originalBarState: 'IL',
          practiceType: 'Private',
          practitionerType: 'Attorney',
          role: ROLES.privatePractitioner,
          section: ROLES.privatePractitioner,

          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
    });

    it('should not throw an error when a public user access interactor', async () => {
      const results = await getPractitionerByBarNumberInteractor(
        applicationContext,
        {
          barNumber: 'BN0000',
        },
        undefined,
      );

      expect(results).toBeDefined();
    });

    it('should return an array with Practitioner result', async () => {
      const results = await getPractitionerByBarNumberInteractor(
        applicationContext,
        {
          barNumber: 'BN0000',
        },
        undefined,
      );

      expect(results).toEqual([
        {
          admissionsDate: '2019-03-01',
          admissionsStatus: 'Active',
          barNumber: 'PP1234',
          contact: {
            state: 'IL',
          },
          name: 'Private Practitioner',
          practiceType: 'Private',
          practitionerType: 'Attorney',
        },
      ]);
    });
  });
});
