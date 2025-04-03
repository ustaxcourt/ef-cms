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
    it('instantiates a docket clerk user when passed a record with all required fields populated', () => {
      const validUuid = v4();
      const userDataFromPostgres = {
        name: 'Test Docketclerk',
        role: 'docketclerk',
        userId: validUuid,
        userType: 'User',
      };

      const result = userEntity(userDataFromPostgres);

      expect(result).toBeInstanceOf(User);
      expect(result.isValid()).toBe(true);
    });

    it('instantiates a docket clerk user when passed a record that includes a date', () => {
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

      const result = userEntity(userDataFromPostgres);

      expect(result).toBeInstanceOf(User);
      expect(result.isValid()).toBe(true);
      expect(result.pendingEmailVerificationTokenTimestamp).toBeDefined();
      expect(
        isValidISODate(result.pendingEmailVerificationTokenTimestamp!),
      ).toBe(true);
    });
  });

  it('instantiates a docket clerk user when passed a record that includes contact information', () => {
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

    const result = userEntity(userDataFromPostgres);

    expect(result).toBeInstanceOf(User);
    expect(result.isValid()).toBe(true);
    expect(result.contact).toBeDefined();
  });
});
