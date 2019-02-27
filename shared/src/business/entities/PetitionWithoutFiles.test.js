const PetitionWithoutFiles = require('./PetitionWithoutFiles');

describe('PetitionWithoutFiles entity', () => {
  describe('isValid', () => {
    it('assigns a new irsNoticeDate if one is not passed in', () => {
      const petition = new PetitionWithoutFiles({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        irsNoticeDate: null,
      });
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
