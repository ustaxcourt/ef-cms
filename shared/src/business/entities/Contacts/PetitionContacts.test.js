const Petition = require('../Petition');

let petition;

describe('Petition', () => {
  describe('for Corporation Contacts', () => {
    it('should not validate without contact', () => {
      petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        petitionFile: {},
        signature: true,
        partyType: 'Corporation',
      });
      expect(petition.isValid()).toEqual(false);
    });

    it('can validate primary contact', () => {
      petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        petitionFile: {},
        signature: true,
        partyType: 'Corporation',
        contactPrimary: {
          countryType: 'domestic',
          name: 'Jimmy Dean',
          inCareOf: 'USTC',
          address1: '876 12th Ave',
          city: 'Nashville',
          state: 'AK',
          postalCode: '05198',
          country: 'USA',
          phone: '1234567890',
          email: 'someone@example.com',
        },
      });
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
  });

  it('can validate Petitioner contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Petitioner',
      contactPrimary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        inCareOf: 'USTC',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('returns true when contactPrimary is defined and everything else is valid', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType:
        'Estate without an Executor/Personal Representative/Fiduciary/etc.',
      contactPrimary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        inCareOf: 'USTC',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('returns false for isValid if primary contact is missing', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType:
        'Estate with an Executor/Personal Representative/Fiduciary/etc.',
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('a valid petition returns true for isValid', () => {
    const petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType:
        'Estate with an Executor/Personal Representative/Fiduciary/etc.',
      contactPrimary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        country: 'USA',
        title: 'Some Title',
        phone: '4444444444',
      },
      contactSecondary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
      },
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Partnership (BBA Regime) contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Partnership (BBA Regime)',
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('can validate valid Partnership (BBA Regime) contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Partnership (BBA Regime)',
      contactPrimary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        inCareOf: 'USTC',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
      contactSecondary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        phone: '1234567890',
      },
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Trust contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Trust',
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('can validate valid Trust contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      hasIrsNotice: true,
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Trust',
      contactPrimary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        inCareOf: 'USTC',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
      contactSecondary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        phone: '1234567890',
      },
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Conservator contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      hasIrsNotice: true,
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Conservator',
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('can validate valid Conservator contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Conservator',
      contactPrimary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        phone: '1234567890',
      },
      contactSecondary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        inCareOf: 'USTC',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Guardian contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Guardian',
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('can validate valid Guardian contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      hasIrsNotice: true,
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Guardian',
      contactPrimary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        phone: '1234567890',
      },
      contactSecondary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        inCareOf: 'USTC',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Custodian contact', () => {
    let petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Custodian',
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('can validate valid Custodian contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      hasIrsNotice: true,
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Custodian',
      contactPrimary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        phone: '1234567890',
      },
      contactSecondary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        inCareOf: 'USTC',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Donor contact', () => {
    let petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Donor',
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('can validate valid Donor contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Donor',
      contactPrimary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Transferee contact', () => {
    let petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Transferee',
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('can validate valid Transferee contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Transferee',
      contactPrimary: {
        countryType: 'domestic',
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        postalCode: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });
});
