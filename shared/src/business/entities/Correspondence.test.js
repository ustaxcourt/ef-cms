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
        {
          documentId: 'e9ab90a9-2150-4dd1-90b4-fee2097c23db',
          documentTitle: 'A Title',
          userId: 'a389ca07-f19e-45d4-8e77-5cb79c9285ae',
        },
        { applicationContext },
      );
      expect(correspondence.isValid()).toBeTruthy();
    });
  });
});
