const { applicationContext } = require('../test/createTestApplicationContext');
const { Stamp } = require('./Stamp');

const { VALIDATION_ERROR_MESSAGES } = Stamp;

describe('Stamp entity', () => {
  describe('Validation', () => {
    it('should be invalid when status is undefined', () => {
      const stamp = new Stamp({
        applicationContext,
        rawStamp: {},
      });

      expect(stamp.getFormattedValidationErrors()).toMatchObject({
        status: VALIDATION_ERROR_MESSAGES.status,
      });
    });
  });
});
