// Cypress 16 requires public env vars to be published via `expose` for sync browser access; credentials stay out and are read via process.env.CYPRESS_* in Node task helpers instead.
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

// Cypress 15 auto-coerced 'true'/'false' to booleans; `expose` gives raw strings, so normalize here.
const normalizeValue = (value: string): string | boolean => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

export const getExposedCypressEnv = (): Record<string, string | boolean> =>
  PUBLIC_ENV_KEYS.reduce(
    (exposed: Record<string, string | boolean>, key: string) => {
      const value = process.env[`CYPRESS_${key}`];
      if (value !== undefined) {
        exposed[key] = normalizeValue(value);
      }
      return exposed;
    },
    {},
  );
