const { Case, getContactPrimary } = require('./Case');
const { CONTACT_TYPES, PARTY_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getCaseCaption', () => {
  it('gets the primary contact from the petitioners array', () => {
    const caseCaption = Case.getCaseCaption({
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          contactType: CONTACT_TYPES.primary,
          name: 'Bob Smith',
        },
      ],
    });
    expect(caseCaption).toEqual('Bob Smith, Petitioner');
  });

  it('gets the primary contact from the petitioners array and trims spaces', () => {
    const caseCaption = Case.getCaseCaption({
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          contactType: CONTACT_TYPES.primary,
          name: '    Bob Smith                 ',
        },
      ],
    });
    expect(caseCaption).toEqual('Bob Smith, Petitioner');
  });

  it('gets the primary contact from contactPrimary property if petitioners array does not exist', () => {
    const caseCaption = Case.getCaseCaption({
      contactPrimary: {
        contactType: CONTACT_TYPES.primary,
        name: 'Bob Smith',
      },
      partyType: PARTY_TYPES.petitioner,
    });
    expect(caseCaption).toEqual('Bob Smith, Petitioner');
  });

  it('party type Petitioner', () => {
    const caseCaption = Case.getCaseCaption(MOCK_CASE);

    expect(caseCaption).toEqual('Test Petitioner, Petitioner');
  });

  it('party type Petitioner & Spouse', () => {
    const caseCaption = Case.getCaseCaption({
      ...MOCK_CASE,
      contactSecondary: {
        name: 'Test Petitioner 2',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseCaption).toEqual(
      'Test Petitioner & Test Petitioner 2, Petitioners',
    );
  });

  it('party type Petitioner & Deceased Spouse', () => {
    const caseCaption = Case.getCaseCaption({
      ...MOCK_CASE,
      contactSecondary: {
        name: 'Test Petitioner 2',
      },
      partyType: PARTY_TYPES.petitionerDeceasedSpouse,
    });
    expect(caseCaption).toEqual(
      'Test Petitioner & Test Petitioner 2, Deceased, Test Petitioner, Surviving Spouse, Petitioners',
    );
  });

  it('party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
    const mockCase = {
      ...MOCK_CASE,
      partyType: PARTY_TYPES.estate,
    };
    getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

    const caseCaption = Case.getCaseCaption(mockCase);

    expect(caseCaption).toEqual(
      'Estate of Test Petitioner, Deceased, Test Petitioner 2, Executor, Petitioner(s)',
    );
  });

  it('party type Estate without an Executor/Personal Representative/Fiduciary/etc.', () => {
    const caseCaption = Case.getCaseCaption({
      ...MOCK_CASE,
      partyType: PARTY_TYPES.estateWithoutExecutor,
    });

    expect(caseCaption).toEqual(
      'Estate of Test Petitioner, Deceased, Petitioner',
    );
  });

  it('party type Trust', () => {
    const mockCase = {
      ...MOCK_CASE,
      partyType: PARTY_TYPES.trust,
    };
    getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

    const caseCaption = Case.getCaseCaption(mockCase);

    expect(caseCaption).toEqual(
      'Test Petitioner, Test Petitioner 2, Trustee, Petitioner(s)',
    );
  });

  it('party type Corporation', () => {
    const caseCaption = Case.getCaseCaption({
      ...MOCK_CASE,
      partyType: PARTY_TYPES.corporation,
    });
    expect(caseCaption).toEqual('Test Petitioner, Petitioner');
  });

  it('party type Partnership Tax Matters', () => {
    const mockCase = {
      ...MOCK_CASE,
      partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
    };
    getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

    const caseCaption = Case.getCaseCaption(mockCase);

    expect(caseCaption).toEqual(
      'Test Petitioner, Test Petitioner 2, Tax Matters Partner, Petitioner',
    );
  });

  it('party type Partnership Other Than Tax Matters', () => {
    const mockCase = {
      ...MOCK_CASE,
      partyType: PARTY_TYPES.partnershipOtherThanTaxMatters,
    };
    getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

    const caseCaption = Case.getCaseCaption(mockCase);

    expect(caseCaption).toEqual(
      'Test Petitioner, Test Petitioner 2, A Partner Other Than the Tax Matters Partner, Petitioner',
    );
  });

  it('party type Partnership BBA', () => {
    const mockCase = {
      ...MOCK_CASE,
      partyType: PARTY_TYPES.partnershipBBA,
    };
    getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

    const caseCaption = Case.getCaseCaption(mockCase);

    expect(caseCaption).toEqual(
      'Test Petitioner, Test Petitioner 2, Partnership Representative, Petitioner(s)',
    );
  });

  it('party type Conservator', () => {
    const mockCase = {
      ...MOCK_CASE,
      partyType: PARTY_TYPES.conservator,
    };
    getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

    const caseCaption = Case.getCaseCaption(mockCase);

    expect(caseCaption).toEqual(
      'Test Petitioner, Test Petitioner 2, Conservator, Petitioner',
    );
  });

  it('party type Guardian', () => {
    const mockCase = {
      ...MOCK_CASE,
      partyType: PARTY_TYPES.guardian,
    };
    getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

    const caseCaption = Case.getCaseCaption(mockCase);

    expect(caseCaption).toEqual(
      'Test Petitioner, Test Petitioner 2, Guardian, Petitioner',
    );
  });

  it('party type Custodian', () => {
    const mockCase = {
      ...MOCK_CASE,
      partyType: PARTY_TYPES.custodian,
    };
    getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

    const caseCaption = Case.getCaseCaption(mockCase);

    expect(caseCaption).toEqual(
      'Test Petitioner, Test Petitioner 2, Custodian, Petitioner',
    );
  });

  it('party type Minor', () => {
    const mockCase = {
      ...MOCK_CASE,
      partyType: PARTY_TYPES.nextFriendForMinor,
    };
    getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

    const caseCaption = Case.getCaseCaption(mockCase);

    expect(caseCaption).toEqual(
      'Test Petitioner, Minor, Test Petitioner 2, Next Friend, Petitioner',
    );
  });

  it('party type Legally Incompetent Person', () => {
    const mockCase = {
      ...MOCK_CASE,
      partyType: PARTY_TYPES.nextFriendForIncompetentPerson,
    };
    getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

    const caseCaption = Case.getCaseCaption(mockCase);

    expect(caseCaption).toEqual(
      'Test Petitioner, Incompetent, Test Petitioner 2, Next Friend, Petitioner',
    );
  });

  it('party type Donor', () => {
    const caseCaption = Case.getCaseCaption({
      ...MOCK_CASE,
      partyType: PARTY_TYPES.donor,
    });

    expect(caseCaption).toEqual('Test Petitioner, Donor, Petitioner');
  });

  it('party type Transferee', () => {
    const caseCaption = Case.getCaseCaption({
      ...MOCK_CASE,
      partyType: PARTY_TYPES.transferee,
    });

    expect(caseCaption).toEqual('Test Petitioner, Transferee, Petitioner');
  });

  it('party type Surviving Spouse', () => {
    const mockCase = {
      ...MOCK_CASE,
      partyType: PARTY_TYPES.survivingSpouse,
    };
    getContactPrimary(mockCase).secondaryName = 'Test Petitioner 2';

    const caseCaption = Case.getCaseCaption(mockCase);

    expect(caseCaption).toEqual(
      'Test Petitioner, Deceased, Test Petitioner 2, Surviving Spouse, Petitioner',
    );
  });
});
