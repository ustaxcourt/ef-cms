/**
 * Cypress 16 removed `Cypress.env()`. Values in the `env` config are now treated
 * as sensitive: they stay in the Node process and are only readable
 * asynchronously via `cy.env()`. Values our specs read synchronously in the
 * browser must be published through the `expose` config instead, which is built
 * here in Node when a cypress config file is loaded.
 *
 * Anything genuinely sensitive (AWS credentials, the postgres password) is
 * deliberately absent from this list. Those are only ever read in Node by the
 * task helpers under `cypress/helpers/cypressTasks`, which read
 * `process.env.CYPRESS_*` directly.
 */
const PUBLIC_ENV_KEYS = [
  'DEFAULT_ACCOUNT_PASS',
  'DEPLOYING_COLOR',
  'DISABLE_EMAILS',
  'EFCMS_DOMAIN',
  'MIGRATE',
  'PAY_GOV_ORIGIN',
  'SMOKETEST_BUCKET',
  'TARGET_ENV',
];

export const getExposedCypressEnv = (): Record<string, string> =>
  PUBLIC_ENV_KEYS.reduce((exposed: Record<string, string>, key: string) => {
    const value = process.env[`CYPRESS_${key}`];
    if (value !== undefined) {
      exposed[key] = value;
    }
    return exposed;
  }, {});
