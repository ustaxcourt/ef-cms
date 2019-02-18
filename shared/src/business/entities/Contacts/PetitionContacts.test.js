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
        irsNoticeDate: '2009-10-13',
        petitionFile: {},
        signature: true,
        partyType: 'Corporation',
        contactPrimary: {
          name: 'Jimmy Dean',
          inCareOf: 'USTC',
          address1: '876 12th Ave',
          city: 'Nashville',
          state: 'AK',
          zip: '05198',
          country: 'USA',
          phone: '1234567890',
          email: 'someone@example.com',
        },
      });
      expect(petition.isValid()).toEqual(true);
    });
  });

  it('can validate Petitioner contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Petitioner',
      contactPrimary: {
        name: 'Jimmy Dean',
        inCareOf: 'USTC',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
    });
    expect(petition.isValid()).toEqual(true);
  });

  it('can validate Estate without Executor/Personal Representative/Etc. contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Estate without Executor/Personal Representative/Etc.',
      contactPrimary: {
        name: 'Jimmy Dean',
        inCareOf: 'USTC',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
    });
    expect(petition.isValid()).toEqual(true);
  });

  it('can validate Estate with Executor/Personal Representative/Etc. contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Estate with Executor/Personal Representative/Etc.',
    });
    expect(petition.isValid()).toEqual(false);
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Estate with Executor/Personal Representative/Etc.',
      contactPrimary: {
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        country: 'USA',
      },
      contactSecondary: {
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        phone: '1234567890',
      },
    });
    expect(petition.isValid()).toEqual(true);
  });

  it('can validate Partnership (BBA Regime) contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Partnership (BBA Regime)',
    });
    expect(petition.isValid()).toEqual(false);
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Partnership (BBA Regime)',
      contactPrimary: {
        name: 'Jimmy Dean',
        inCareOf: 'USTC',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
      contactSecondary: {
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        phone: '1234567890',
      },
    });
    expect(petition.isValid()).toEqual(true);
  });

  it('can validate Trust & Trustee contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Trust & Trustee',
    });
    expect(petition.isValid()).toEqual(false);
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Trust & Trustee',
      contactPrimary: {
        name: 'Jimmy Dean',
        inCareOf: 'USTC',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
      contactSecondary: {
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        phone: '1234567890',
      },
    });
    expect(petition.isValid()).toEqual(true);
  });

  it('can validate Conservator contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Conservator',
    });
    expect(petition.isValid()).toEqual(false);
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Conservator',
      contactPrimary: {
        name: 'Jimmy Dean',
        inCareOf: 'USTC',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
      contactSecondary: {
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        phone: '1234567890',
      },
    });
    expect(petition.isValid()).toEqual(true);
  });

  it('can validate Guardian contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Guardian',
    });
    expect(petition.isValid()).toEqual(false);

    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Guardian',
      contactPrimary: {
        name: 'Jimmy Dean',
        inCareOf: 'USTC',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
      contactSecondary: {
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        phone: '1234567890',
      },
    });
    expect(petition.isValid()).toEqual(true);
  });

  it('can validate Custodian contact', () => {
    let petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Custodian',
    });
    expect(petition.isValid()).toEqual(false);

    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Custodian',
      contactPrimary: {
        name: 'Jimmy Dean',
        inCareOf: 'USTC',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        country: 'USA',
        phone: '1234567890',
        email: 'someone@example.com',
      },
      contactSecondary: {
        name: 'Jimmy Dean',
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        phone: '1234567890',
      },
    });
    expect(petition.isValid()).toEqual(true);
  });
});
