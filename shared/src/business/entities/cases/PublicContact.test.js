const { PublicContact } = require('./PublicContact');

describe('PublicContact', () => {
  describe('validation', () => {
    it('passes validation for any state value', () => {
      const validContact = new PublicContact({
        name: 'Price Cole',
        state: 'Assam',
      });

      expect(validContact.getFormattedValidationErrors()).toBeNull();
    });
  });
});
