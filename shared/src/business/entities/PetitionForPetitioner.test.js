const PetitionForPetitioner = require('./PetitionForPetitioner');

xdescribe('Petition', () => {
  describe('for Petitioner', () => {
    it('can validate primary contact name', () => {
      const petition = new PetitionForPetitioner({
        contactPrimary: {},
      });
      const errors = petition.getValidationErrors();
      console.log(errors);
      expect(petition.isValid()).toEqual(true);
    });
  });
});
