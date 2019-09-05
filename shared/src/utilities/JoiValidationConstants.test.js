const { JoiValidationConstants } = require('./JoiValidationConstants');

describe('JoiValidationConstants', () => {
  describe('postal code validation', () => {
    it('validates 5-digit zipcodes', () => {
      const { error } = JoiValidationConstants.US_POSTAL_CODE.validate('12345');
      expect(error).toBeFalsy();
    });
    it('validates 5+4 zipcodes', () => {
      const { error } = JoiValidationConstants.US_POSTAL_CODE.validate(
        '12345-9876',
      );
      expect(error).toBeFalsy();
    });
    it('rejects bad zipcodes', () => {
      const { error } = JoiValidationConstants.US_POSTAL_CODE.validate('1234A');
      expect(error).not.toBeFalsy();
    });
  });

  describe('24-hour time validation', () => {
    it('validates times in 24-hour format', () => {
      let result;
      result = JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES.validate('00:23');
      expect(result.error).toBeFalsy();

      result = JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES.validate('19:58');
      expect(result.error).toBeFalsy();

      result = JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES.validate('23:00');
      expect(result.error).toBeFalsy();
    });
    it('rejects invalid times or formats', () => {
      let result;
      result = JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES.validate('0:23');
      expect(result.error).toBeTruthy();

      result = JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES.validate('19.58');
      expect(result.error).toBeTruthy();

      result = JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES.validate(
        '5:00pm',
      );
      expect(result.error).toBeTruthy();
    });
  });
});
