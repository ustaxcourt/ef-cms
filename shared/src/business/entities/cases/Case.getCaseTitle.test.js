const { Case } = require('./Case');
const { CONTACT_TYPES, PARTY_TYPES } = require('../EntityConstants');

describe('getCaseTitle', () => {
  it('party type Petitioner', () => {
    const caseTitle = Case.getCaseTitle('Test Petitioner, Petitioner');
    expect(caseTitle).toEqual('Test Petitioner');
  });

  it('party type Petitioner & Spouse', () => {
    const caseTitle = Case.getCaseTitle(
      'Test Petitioner & Test Petitioner 2, Petitioners',
    );
    expect(caseTitle).toEqual('Test Petitioner & Test Petitioner 2');
  });

  it('party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
    const caseTitle = Case.getCaseTitle(
      'Estate of Test Petitioner 2, Deceased, Test Petitioner, Executor, Petitioner(s)',
    );
    expect(caseTitle).toEqual(
      'Estate of Test Petitioner 2, Deceased, Test Petitioner, Executor',
    );
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

  it('where a party is an estate, gets the primary contact from the petitioners array and trims spaces from names and titles', () => {
    const caseCaption = Case.getCaseCaption({
      partyType: PARTY_TYPES.estate,
      petitioners: [
        {
          contactType: CONTACT_TYPES.primary,
          name: '    Frank Frink                 ',
          secondaryName: '        Robert Childan            ',
          title: '    Proprietor                 ',
        },
      ],
    });
    expect(caseCaption).toEqual(
      'Estate of Frank Frink, Deceased, Robert Childan, Proprietor, Petitioner(s)',
    );
  });

  it('where party is petitioner and spouse, gets the primary contact from the petitioners array and trims spaces from all names', () => {
    const caseCaption = Case.getCaseCaption({
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        {
          contactType: CONTACT_TYPES.primary,
          name: '      John Smith               ',
        },
        {
          contactType: CONTACT_TYPES.secondary,
          name: '         Helen Smith            ',
        },
      ],
    });
    expect(caseCaption).toEqual('John Smith & Helen Smith, Petitioners');
  });
});
