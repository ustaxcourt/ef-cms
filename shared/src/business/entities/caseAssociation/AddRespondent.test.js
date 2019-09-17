const { AddRespondent } = require('./AddRespondent');

describe('AddRespondent', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = new AddRespondent({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        user: 'Select a respondent counsel',
      });
    });

    it('should be valid when all fields are present', () => {
      const entity = new AddRespondent({ user: { userId: 'abc' } });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
