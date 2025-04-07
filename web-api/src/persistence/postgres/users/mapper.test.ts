import { User } from '@shared/business/entities/User';
import { userEntity } from './mapper';
import { v4 } from 'uuid';
import {
  calculateDate,
  FORMATS,
  isValidISODate,
  prepareDateFromEST,
} from '@shared/business/utilities/DateHandler';
import { COUNTRY_TYPES } from '@shared/business/entities/EntityConstants';

describe('user mapper', () => {
  describe('userEntity', () => {
    it('instantiates a docket clerk User entity when passed a record with all required fields populated', () => {
      const validUuid = v4();
      const userDataFromPostgres = {
        name: 'Test Docketclerk',
        role: 'docketclerk',
        userId: validUuid,
        userType: 'User',
      };

      const result = userEntity(userDataFromPostgres) as User;

      expect(result).toBeInstanceOf(User);
      expect(result.isValid()).toBe(true);
    });

    it('instantiates a docket clerk User entity when passed a record that includes a date', () => {
      const validUuid = v4();
      const dateString =
        prepareDateFromEST('2025-12-31', FORMATS.YYYYMMDD) || undefined;
      const date = calculateDate({ dateString });
      const userDataFromPostgres = {
        name: 'Test Docketclerk',
        pendingEmailVerificationTokenTimestamp: date,
        role: 'docketclerk',
        userId: validUuid,
        userType: 'User',
      };

      const result = userEntity(userDataFromPostgres) as User;

      expect(result).toBeInstanceOf(User);
      expect(result.isValid()).toBe(true);
      expect(result.pendingEmailVerificationTokenTimestamp).toBeDefined();
      expect(
        isValidISODate(result.pendingEmailVerificationTokenTimestamp!),
      ).toBe(true);
    });
  });

  it('instantiates a docket clerk User entity when passed a record that includes contact information', () => {
    const validUuid = v4();
    const userDataFromPostgres = {
      address1: '1 Main St.',
      city: 'Anytown',
      state: 'AK',
      postalCode: '12345',
      country: 'USA',
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Test Docketclerk',
      role: 'docketclerk',
      phone: '123-123-1234',
      userId: validUuid,
      userType: 'User',
    };

    const result = userEntity(userDataFromPostgres) as User;

    expect(result).toBeInstanceOf(User);
    expect(result.isValid()).toBe(true);
    expect(result.contact).toBeDefined();
  });

  // it.only('instantiates a PrivatePractitioner entity when passed a record with all required fields populated', () => {
  //   const validUuid = v4();
  //   const practitionerDataFromPostgres = {
  //     admissionsDate: '?', // what should this be?
  //     admissionsStatus: 'Active',
  //     barNumber: 'ABC123',
  //     birthYear: 1980,
  //     practiceType: 'Private',
  //     firstName: 'Jane',
  //     lastName: 'Private Practitioner',
  //     originalBarState: 'CO',
  //     practitionerType: 'Attorney',
  //     serviceIndicator: 'Electronic',
  //     userId: validUuid,
  //     userType: 'Practitioner',
  //     role: 'privatePractitioner',
  //   };

  //   const result = userEntity(
  //     practitionerDataFromPostgres,
  //   ) as PrivatePractitioner;
  //   console.log(result.getFormattedValidationErrors());

  //   expect(result).toBeInstanceOf(PrivatePractitioner);
  //   expect(result.isValid()).toBe(true);
  // });
});
