import { getNewEmail, getOldEmail } from './calculateEmail';

describe('calculateEmail', () => {
  const exampleEmail = 'test@example.com';

  describe('getOldEmail', () => {
    it('should return an empty string if email is not provided and address is sealed', () => {
      expect(getOldEmail('', true)).toBe('');
    });

    it('should return "SEALED BY COURT ORDER" if email is provided and address is sealed', () => {
      expect(getOldEmail(exampleEmail, true)).toBe('SEALED BY COURT ORDER');
    });
    it('should return "No email provided" if email is not provided and address is not sealed', () => {
      expect(getOldEmail('', false)).toBe('No email provided');
    });
    it('should return the email if email is provided and address is not sealed', () => {
      expect(getOldEmail(exampleEmail, false)).toBe(exampleEmail);
    });
  });
  
  describe('getNewEmail', () => {
    it('should return "SEALED BY COURT ORDER" if address is sealed', () => {
      expect(getNewEmail(exampleEmail, true)).toBe('SEALED BY COURT ORDER');
    });
    it('should return the email if address is not sealed', () => {
      expect(getNewEmail(exampleEmail, false)).toBe(exampleEmail);
    });
  });
});
