const faker = require('faker');
const {
  BASE_CASE,
  CASE_WITH_OTHER_FILERS,
  CASE_WITH_OTHER_PETITIONERS,
} = require('../fixtures/caseMigrations');
const { getRestApi, getUserToken } = require('../support/pages/login');

let token = null;
let restApi = null;

describe('Case Migration', () => {
  let docketNumber;

  before(async () => {
    const results = await getUserToken('migrator@example.com', 'Testing1234$');
    token = results.AuthenticationResult.IdToken;
    restApi = await getRestApi();
  });

  beforeEach(() => {
    const seed = faker.random.number();
    faker.seed(seed);

    const docketNumberYear = faker.random.number({ max: 99, min: 80 });
    const docketNumberPrefix = faker.random.number({ max: 99999, min: 0 });

    docketNumber = `${docketNumberPrefix}-${docketNumberYear}`;

    console.log(`Migrating Docket No. ${docketNumber}.`);
  });

  it('should be able to POST a basic migrated case to the endpoint', () => {
    cy.request({
      body: { ...BASE_CASE, docketNumber },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      url: `${restApi}/migrate/case`,
    });
  });

  it('should be able to POST a migrated case with other petitioners to the endpoint', () => {
    cy.request({
      body: {
        ...CASE_WITH_OTHER_PETITIONERS,
        docketNumber,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      url: `${restApi}/migrate/case`,
    });
  });

  it('should be able to POST a migrated case with other filers to the endpoint', () => {
    cy.request({
      body: {
        ...CASE_WITH_OTHER_FILERS,
        docketNumber,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      url: `${restApi}/migrate/case`,
    });
  });
});
