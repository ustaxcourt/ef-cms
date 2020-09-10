const {
  addDocketEntryAndServeOpinion,
  createOpinion,
  gotoAdvancedPractitionerSearch,
  gotoAdvancedSearch,
  goToOpinionSearch,
  searchByDocketNumber,
  searchByPetitionerName,
  searchByPractitionerbarNumber,
  searchByPractitionerName,
  searchOpinionByKeyword,
  signOpinion,
} = require('../support/pages/advanced-search');
const { goToCaseDetail } = require('../support/pages/case-detail');

const { getUserToken, login } = require('../support/pages/login');

const docketNumberToSearchBy = '103-20';
const barNumberToSearchBy = 'PT1234';
let token;

describe('Case Advanced Search', () => {
  before(async () => {
    const results = await getUserToken(
      'docketclerk1@example.com',
      'Testing1234$',
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to search for case by practitioner name', () => {
    gotoAdvancedSearch();
    searchByPetitionerName();
  });

  it('should be able to search for case by docket number', () => {
    gotoAdvancedSearch();
    searchByDocketNumber(docketNumberToSearchBy);
  });
});

describe('Practitoner Search', () => {
  before(async () => {
    const results = await getUserToken(
      'docketclerk1@example.com',
      'Testing1234$',
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to search for a practitioner by name', () => {
    gotoAdvancedPractitionerSearch();
    searchByPractitionerName();
  });

  it('should be able to search for for a practitioner by bar number', () => {
    gotoAdvancedPractitionerSearch();
    searchByPractitionerbarNumber(barNumberToSearchBy);
  });
});

describe('Opinion Search', () => {
  before(async () => {
    const results = await getUserToken(
      'docketclerk1@example.com',
      'Testing1234$',
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should create an opinion to search for', () => {
    goToCaseDetail(docketNumberToSearchBy);
    createOpinion();
    addDocketEntryAndServeOpinion();
  });

  it('should be able to search for an opinion by keyword', () => {
    goToOpinionSearch();
    searchOpinionByKeyword('opinion');
  });
});
