const { getIsFeatureEnabled } = require('./getIsFeatureEnabled');
const { ROLES } = require('../entities/EntityConstants');

describe('getIsFeatureEnabled', () => {
  describe('advanced_document_search', () => {
    it('returns true if the user is an internal user and the current environment is NOT prod', () => {
      const user = {
        role: ROLES.judge,
      };
      const env = 'mig';

      const isEnabled = getIsFeatureEnabled(
        'advanced_document_search',
        user,
        env,
      );

      expect(isEnabled).toEqual(true);
    });

    it('returns false if the user is NOT an internal user and the current environment is NOT prod', () => {
      const user = {
        role: ROLES.privatePractitioner,
      };
      const env = 'mig';

      const isEnabled = getIsFeatureEnabled(
        'advanced_document_search',
        user,
        env,
      );

      expect(isEnabled).toEqual(false);
    });

    it('returns false if the user is an internal user and the current environment is prod', () => {
      const user = {
        role: ROLES.judge,
      };
      const env = 'prod';

      const isEnabled = getIsFeatureEnabled(
        'advanced_document_search',
        user,
        env,
      );

      expect(isEnabled).toEqual(false);
    });
  });
});
