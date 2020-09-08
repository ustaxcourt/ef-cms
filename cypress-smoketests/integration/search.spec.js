const {
  gotoAdvancedPractitionerSearch,
  gotoAdvancedSearch,
  goToOpinionSearch,
  goToOrderSearch,
  searchByDocketNumber,
  searchByPetitionerName,
  searchByPractitionerbarNumber,
  searchByPractitionerName,
  searchOpinionByKeyword,
  searchOrderByKeyword,
} = require('../support/pages/advanced-search');

const { getUserToken, login } = require('../support/pages/login');

const docketNumberToSearchBy = '103-20';
const barNumberToSearchBy = 'PT1234';
let token;

describe('Case Advanced Search', () => {
  //create a case?
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
  //create a case?
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

describe('Order Search', () => {
  //create a case?
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

  it('should  search for an order by keyword', () => {
    goToOrderSearch();
    searchOrderByKeyword('order');
  });
});

describe('Opinion Search', () => {
  //create a case?
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

  it('should be able to search for an opinion by keyword', () => {
    goToOpinionSearch();
    searchOpinionByKeyword('opinion');
  });
});
