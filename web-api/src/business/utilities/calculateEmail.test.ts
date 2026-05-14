import {
  formattedNewEmailForChangeOfAddress,
  formattedOldEmailForChangeOfAddress,
} from './calculateEmail';

describe('calculateEmail', () => {
  const exampleEmail = 'test@example.com';

  describe('formattedOldEmailForChangeOfAddress', () => {
    it('should return an empty string if email is not provided and address is sealed', () => {
      expect(formattedOldEmailForChangeOfAddress('', true)).toBe('');
    });

    it('should return "SEALED BY COURT ORDER" if email is provided and address is sealed', () => {
      expect(formattedOldEmailForChangeOfAddress(exampleEmail, true)).toBe(
        'SEALED BY COURT ORDER',
      );
    });
    it('should return "No email provided" if email is not provided and address is not sealed', () => {
      expect(formattedOldEmailForChangeOfAddress('', false)).toBe(
        'No email provided',
      );
    });
    it('should return the email if email is provided and address is not sealed', () => {
      expect(formattedOldEmailForChangeOfAddress(exampleEmail, false)).toBe(
        exampleEmail,
      );
    });
  });

  describe('formattedNewEmailForChangeOfAddress', () => {
    it('should return "SEALED BY COURT ORDER" if address is sealed', () => {
      expect(formattedNewEmailForChangeOfAddress(exampleEmail, true)).toBe(
        'SEALED BY COURT ORDER',
      );
    });
    it('should return the email if address is not sealed', () => {
      expect(formattedNewEmailForChangeOfAddress(exampleEmail, false)).toBe(
        exampleEmail,
      );
    });
  });
});
