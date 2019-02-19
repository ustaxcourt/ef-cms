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

  it('can validate Estate without an Executor/Personal Representative/Fiduciary/etc. contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType:
        'Estate without an Executor/Personal Representative/Fiduciary/etc.',
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

  it('can validate Estate with an Executor/Personal Representative/Fiduciary/etc. contact', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType:
        'Estate with an Executor/Personal Representative/Fiduciary/etc.',
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
      partyType:
        'Estate with an Executor/Personal Representative/Fiduciary/etc.',
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

  it('can validate Trust', () => {
    petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Trust',
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
      partyType: 'Trust',
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
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        phone: '1234567890',
      },
      contactSecondary: {
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
        address1: '876 12th Ave',
        city: 'Nashville',
        state: 'AK',
        zip: '05198',
        phone: '1234567890',
      },
      contactSecondary: {
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

  it('can validate Donor contact', () => {
    let petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Donor',
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
      partyType: 'Donor',
      contactPrimary: {
        name: 'Jimmy Dean',
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

  it('can validate Transferee contact', () => {
    let petition = new Petition({
      caseType: 'other',
      procedureType: 'Small',
      filingType: 'Myself',
      preferredTrialCity: 'Chattanooga, TN',
      irsNoticeDate: '2009-10-13',
      petitionFile: {},
      signature: true,
      partyType: 'Transferee',
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
      partyType: 'Transferee',
      contactPrimary: {
        name: 'Jimmy Dean',
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
