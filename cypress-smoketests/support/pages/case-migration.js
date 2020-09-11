const faker = require('faker');
const { BASE_CASE } = require('../../fixtures/caseMigrations');
const { getRestApi, getUserToken } = require('./login');

/**
 *
 */
async function migrateGeneratedCase() {
  let migratedCase;
  const results = await getUserToken('migrator@example.com', 'Testing1234$');
  const restApi = await getRestApi();
  const token = results.AuthenticationResult.IdToken;
  faker.seed(faker.random.number());
  const docketNumberYear = faker.random.number({ max: 99, min: 80 });
  const docketNumberPrefix = faker.random.number({ max: 99999, min: 0 });
  const docketNumber = `${docketNumberPrefix}-${docketNumberYear}`;

  cy.server();
  cy.route({ method: 'POST', url: `${restApi}/migrate/case` }).as(
    'migrateCase',
  );
  cy.request({
    body: { ...BASE_CASE, docketNumber },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    url: `${restApi}/migrate/case`,
  });
  cy.wait('@migrateCase').then(xhr => {
    migratedCase = xhr.response.body;
  });
  assert.isDefined(migratedCase);
  return { case: migratedCase, docketNumber };
}

module.exports = { migrateGeneratedCase };
