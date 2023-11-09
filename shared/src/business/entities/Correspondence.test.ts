import { Correspondence, RawCorrespondence } from './Correspondence';

describe('Correspondence', () => {
  const validCorrespondence: RawCorrespondence = {
    archived: false,
    correspondenceId: 'e9ab90a9-2150-4dd1-90b4-fee2097c23db',
    documentTitle: 'A Title',
    entityName: 'Correspondence',
    filedBy: 'Nika Manpreet',
    filingDate: '2019-01-05T01:02:03.004Z',
    userId: 'a389ca07-f19e-45d4-8e77-5cb79c9285ae',
  };

  describe('validation', () => {
    it('should be valid when all required fields are present', () => {
      const correspondence = new Correspondence(validCorrespondence);

      expect(correspondence.isValid()).toBe(true);
      expect(correspondence.getFormattedValidationErrors()).toBeNull();
    });
  });

  it('should populate optional fields when they are not provided in the constructor', () => {
    const correspondence = new Correspondence({
      archived: true,
      correspondenceId: 'e9ab90a9-2150-4dd1-90b4-fee2097c23db',
      documentTitle: 'A Title',
      filedBy: 'A dog',
      filingDate: undefined,
      userId: 'a389ca07-f19e-45d4-8e77-5cb79c9285ae',
    });

    expect(correspondence.filingDate).toBeDefined();
  });
});
