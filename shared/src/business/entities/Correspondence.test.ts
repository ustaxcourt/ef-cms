import { Correspondence } from './Correspondence';

describe('Correspondence', () => {
  const validCorrespondence = {
    correspondenceId: 'e9ab90a9-2150-4dd1-90b4-fee2097c23db',
    documentTitle: 'A Title',
    userId: 'a389ca07-f19e-45d4-8e77-5cb79c9285ae',
  };

  describe('validation', () => {
    it('should be valid when all fields are present', () => {
      const correspondence = new Correspondence(validCorrespondence);

      expect(correspondence.isValid()).toBeTruthy();
      expect(correspondence.entityName).toEqual('Correspondence');
    });

    it('should populate optional fields', () => {
      const correspondence = new Correspondence({
        archived: true,
        correspondenceId: 'e9ab90a9-2150-4dd1-90b4-fee2097c23db',
        documentTitle: 'A Title',
        filedBy: 'A dog',
        userId: 'a389ca07-f19e-45d4-8e77-5cb79c9285ae',
      });

      expect(correspondence.archived).toBeTruthy();
      expect(correspondence.filedBy).toBe('A dog');
    });
  });
});
