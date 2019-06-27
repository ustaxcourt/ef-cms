const { CaseExternal } = require('../CaseExternal');
const { PARTY_TYPES } = require('./PetitionContact');

let caseExternal;

describe('Petition', () => {
  describe('for Corporation Contacts', () => {
    it('should not validate without contact', () => {
      caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.corporation,
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      });
      expect(caseExternal.isValid()).toEqual(false);
    });

    it('can validate primary contact', () => {
      caseExternal = new CaseExternal({
        caseType: 'other',
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          country: 'USA',
          countryType: 'domestic',
          email: 'someone@example.com',
          inCareOf: 'USTC',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.corporation,
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });
  });

  it('can validate Petitioner contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: 'domestic',
        email: 'someone@example.com',
        inCareOf: 'USTC',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.petitioner,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('returns true when contactPrimary is defined and everything else is valid', () => {
    caseExternal = new CaseExternal({
      caseType: 'other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: 'domestic',
        email: 'someone@example.com',
        inCareOf: 'USTC',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.estateWithoutExecutor,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('returns false for isValid if primary contact is missing', () => {
    caseExternal = new CaseExternal({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.estate,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('a valid petition returns true for isValid', () => {
    const caseExternal = new CaseExternal({
      caseType: 'other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: 'domestic',
        name: 'Jimmy Dean',
        phone: '4444444444',
        postalCode: '05198',
        state: 'AK',
        title: 'Some Title',
      },
      contactSecondary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        countryType: 'domestic',
        name: 'Jimmy Dean',
        postalCode: '05198',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.estate,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Partnership (BBA Regime) contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.partnershipBBA,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('can validate valid Partnership (BBA Regime) contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: 'domestic',
        email: 'someone@example.com',
        inCareOf: 'USTC',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      contactSecondary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        countryType: 'domestic',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.partnershipBBA,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Trust contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.trust,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('can validate valid Trust contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: 'domestic',
        email: 'someone@example.com',
        inCareOf: 'USTC',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      contactSecondary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        countryType: 'domestic',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.trust,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Conservator contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.conservator,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('can validate valid Conservator contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        countryType: 'domestic',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      contactSecondary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: 'domestic',
        email: 'someone@example.com',
        inCareOf: 'USTC',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.conservator,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Guardian contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.guardian,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('can validate valid Guardian contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        countryType: 'domestic',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      contactSecondary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: 'domestic',
        email: 'someone@example.com',
        inCareOf: 'USTC',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.guardian,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Custodian contact', () => {
    let caseExternal = new CaseExternal({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.custodian,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('can validate valid Custodian contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        countryType: 'domestic',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      contactSecondary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: 'domestic',
        email: 'someone@example.com',
        inCareOf: 'USTC',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.custodian,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Donor contact', () => {
    let caseExternal = new CaseExternal({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.donor,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('can validate valid Donor contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: 'domestic',
        email: 'someone@example.com',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.donor,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Transferee contact', () => {
    let caseExternal = new CaseExternal({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.transferee,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.isValid()).toEqual(false);
  });

  it('can validate valid Transferee contact', () => {
    caseExternal = new CaseExternal({
      caseType: 'other',
      contactPrimary: {
        address1: '876 12th Ave',
        city: 'Nashville',
        country: 'USA',
        countryType: 'domestic',
        email: 'someone@example.com',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        state: 'AK',
      },
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.transferee,
      petitionFile: {},
      petitionFileSize: 1,
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
      stinFileSize: 1,
    });
    expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
  });
});
