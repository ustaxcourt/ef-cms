const Petition = require('../Petition');
const { PARTY_TYPES } = require('./PetitionContact');

let petition;

describe('Petition', () => {
  describe('for Corporation Contacts', () => {
    it('should not validate without contact', () => {
      petition = new Petition({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.corporation,
        petitionFile: {},
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
      });
      expect(petition.isValid()).toEqual(false);
    });

    it('can validate primary contact', () => {
      petition = new Petition({
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
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
      });
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
  });

  it('can validate Petitioner contact', () => {
    petition = new Petition({
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
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('returns true when contactPrimary is defined and everything else is valid', () => {
    petition = new Petition({
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
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('returns false for isValid if primary contact is missing', () => {
    petition = new Petition({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.estate,
      petitionFile: {},
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('a valid petition returns true for isValid', () => {
    const petition = new Petition({
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
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Partnership (BBA Regime) contact', () => {
    petition = new Petition({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.partnershipBBA,
      petitionFile: {},
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('can validate valid Partnership (BBA Regime) contact', () => {
    petition = new Petition({
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
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Trust contact', () => {
    petition = new Petition({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.trust,
      petitionFile: {},
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('can validate valid Trust contact', () => {
    petition = new Petition({
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
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Conservator contact', () => {
    petition = new Petition({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.conservator,
      petitionFile: {},
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('can validate valid Conservator contact', () => {
    petition = new Petition({
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
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Guardian contact', () => {
    petition = new Petition({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.guardian,
      petitionFile: {},
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('can validate valid Guardian contact', () => {
    petition = new Petition({
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
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Custodian contact', () => {
    let petition = new Petition({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.custodian,
      petitionFile: {},
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('can validate valid Custodian contact', () => {
    petition = new Petition({
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
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Donor contact', () => {
    let petition = new Petition({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.donor,
      petitionFile: {},
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('can validate valid Donor contact', () => {
    petition = new Petition({
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
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });

  it('can validate invalid Transferee contact', () => {
    let petition = new Petition({
      caseType: 'other',
      filingType: 'Myself',
      hasIrsNotice: true,
      irsNoticeDate: '2009-10-13',
      partyType: PARTY_TYPES.transferee,
      petitionFile: {},
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.isValid()).toEqual(false);
  });

  it('can validate valid Transferee contact', () => {
    petition = new Petition({
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
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      signature: true,
      stinFile: {},
    });
    expect(petition.getFormattedValidationErrors()).toEqual(null);
  });
});
