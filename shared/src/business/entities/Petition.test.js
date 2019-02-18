const Petition = require('./Petition');

describe('Petition', () => {
  describe('irs notice date validation', () => {
    it('should require notice date', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        petitionFile: {},
        signature: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
      });
      expect(petition.getFormattedValidationErrors().irsNoticeDate).toEqual(
        'Notice Date is a required field.',
      );
    });

    it('should require notice date', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        irsNoticeDate: '3009-10-13',
        petitionFile: {},
        signature: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
      });
      expect(petition.getFormattedValidationErrors().irsNoticeDate).toEqual(
        'Notice Date is in the future. Please enter a valid date.',
      );
    });
  });
});
