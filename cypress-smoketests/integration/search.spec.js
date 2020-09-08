const {
  gotoAdvancedSearch,
  searchByDocketNumber,
  searchByPetitionerName,
} = require('../support/pages/advanced-search');
const { getUserToken, login } = require('../support/pages/login');

const docketNumberToSearchBy = '103-20';
let token;

describe('Case Search', () => {
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
