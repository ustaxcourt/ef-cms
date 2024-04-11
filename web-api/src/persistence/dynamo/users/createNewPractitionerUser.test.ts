import {
  ADMISSIONS_STATUS_OPTIONS,
  PRACTITIONER_TYPE_OPTIONS,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createNewPractitionerUser } from './createNewPractitionerUser';
import { put } from '../../dynamodbClientService';

jest.mock('../../dynamodbClientService', () => ({
  put: jest.fn(),
}));
const mockPut = put as jest.Mock;

describe('createNewPractitionerUser', () => {
  const mockNewPractitionerUser: RawPractitioner = {
    admissionsDate: '09/01/2020',
    admissionsStatus: ADMISSIONS_STATUS_OPTIONS[0],
    barNumber: 'tpp1234',
    birthYear: '1990',
    employer: 'Lawyers, INC',
    entityName: 'Practitioner',
    firstName: 'Test Private',
    lastName: 'Practitioner',
    name: 'Test Private Practitioner',
    originalBarState: 'OR',
    pendingEmail: 'practitioner@example.com',
    practitionerType: PRACTITIONER_TYPE_OPTIONS[0],
    role: ROLES.privatePractitioner,
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    userId: '16c6e88c-b333-4eb7-981b-ee97f647c4db',
  };

  it('should not log an error when creating a new cognito account for a practitioner user', async () => {
    await createNewPractitionerUser({
      applicationContext,
      user: mockNewPractitionerUser,
    });

    expect(applicationContext.getUserGateway().createUser).toHaveBeenCalledWith(
      applicationContext,
      {
        attributesToUpdate: {
          email: mockNewPractitionerUser.pendingEmail,
          name: mockNewPractitionerUser.name,
          role: mockNewPractitionerUser.role,
          userId: mockNewPractitionerUser.userId,
        },
        email: mockNewPractitionerUser.pendingEmail,
        resendInvitationEmail: false,
      },
    );
  });

  describe('updateUserRecords', () => {
    it('should create new records in persistence for the practitioner with uppercase name and bar number', async () => {
      await createNewPractitionerUser({
        applicationContext,
        user: mockNewPractitionerUser,
      });

      const roleBasedRecord = mockPut.mock.calls[1][0].Item;
      expect(roleBasedRecord.pk).toEqual(
        `${ROLES.privatePractitioner}|TEST PRIVATE PRACTITIONER`,
      );
      const barNumberBasedRecord = mockPut.mock.calls[2][0].Item;
      expect(barNumberBasedRecord.pk).toEqual(
        `${ROLES.privatePractitioner}|TPP1234`,
      );
    });
  });
});
