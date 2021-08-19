const { PublicContact } = require('./PublicContact');

describe('PublicContact', () => {
  describe('validation', () => {
    it('passes validation for any state value', () => {
      const validContact = new PublicContact({
        contactId: 'f99205ce-fd41-4e41-9fc2-0510692b1db4',
        name: 'Price Cole',
        state: 'Assam',
      });

      expect(validContact.getFormattedValidationErrors()).toBeNull();
    });
  });
});
