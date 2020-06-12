const { applicationContext } = require('../test/createTestApplicationContext');
const { Correspondence } = require('./Correspondence');

describe('Correspondence', () => {
  describe('validation', () => {
    it('should fail validation when required fields are missing', () => {
      const correspondence = new Correspondence({}, { applicationContext });
      expect(correspondence.isValid()).toBeFalsy();
    });

    it('should be valid when all fields are present', () => {
      const correspondence = new Correspondence(
        { documentId: '123', documentTitle: 'A Title', userId: '111' },
        { applicationContext },
      );
      expect(correspondence.isValid()).toBeTruthy();
    });
  });
});
