const Petition = require('./Petition');

describe('Petition entity', () => {
  describe('isValid', () => {
    it('requires ownership disclosure if filing type is a business', () => {
      const petition = new Petition({
        businessType: 'Corporation',
        caseType: 'other',
        filingType: 'A business',
        hasIrsNotice: false,
        irsNoticeDate: null,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        petition.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toEqual('Ownership Disclosure Statement is required.');
    });
    it('does not require ownership disclosure if filing type not set', () => {
      const petition = new Petition({
        caseType: 'other',
        hasIrsNotice: false,
        irsNoticeDate: null,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        petition.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toBeUndefined();
    });
    it('does not require ownership disclosure if filing type not a business', () => {
      const petition = new Petition({
        caseType: 'other',
        filingType: 'not a biz',
        hasIrsNotice: false,
        irsNoticeDate: null,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        petition.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toBeUndefined();
    });
  });

  describe('irs notice date validation', () => {
    it('should require notice date', () => {
      const petition = new Petition({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: {},
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
      });
      expect(petition.getFormattedValidationErrors().irsNoticeDate).toEqual(
        'Notice Date is a required field.',
      );
    });

    it('should not require notice date', () => {
      const petition = new Petition({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: {},
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
      });
      expect(
        petition.getFormattedValidationErrors().irsNoticeDate,
      ).toBeUndefined();
    });

    it('should not require case type without indicating they have a notice ', () => {
      const petition = new Petition({
        filingType: 'Myself',
        hasIrsNotice: undefined,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: {},
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
      });
      expect(petition.getFormattedValidationErrors().caseType).toBeUndefined();
    });

    it('should inform you if notice date is in the future', () => {
      const petition = new Petition({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '3009-10-13',
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: {},
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
      });
      expect(petition.getFormattedValidationErrors().irsNoticeDate).toEqual(
        'Notice Date is in the future. Please enter a valid date.',
      );
    });
  });
});
