const { PetitionWithoutFiles } = require('./PetitionWithoutFiles');

describe('PetitionWithoutFiles entity', () => {
  describe('isValid', () => {
    it('assigns a new irsNoticeDate if one is not passed in', () => {
      const petition = new PetitionWithoutFiles({
        caseType: 'other',
        filingType: 'Myself',
        irsNoticeDate: null,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
