import { RuleTester } from 'eslint';
import joiIsoDateUtcRule from '../../eslint-custom-rules/eslint-joi-iso-date-utc-rule.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

const invalidMessageId = 'missingUtc';

ruleTester.run('joi-iso-date-utc', joiIsoDateUtcRule, {
  invalid: [
    {
      code: `joi.date().iso().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');`,
      errors: [{ messageId: invalidMessageId }],
    },
    {
      code: `joi.date().iso().format(['YYYY-MM-DDTHH:mm:ss.SSS[Z]']);`,
      errors: [{ messageId: invalidMessageId }],
    },
    {
      code: `joi.date().iso().format({ format: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]' });`,
      errors: [{ messageId: invalidMessageId }],
    },
    {
      code: `joi.date().iso().format({ format: ['YYYY-MM-DDTHH:mm:ss.SSS[Z]'] });`,
      errors: [{ messageId: invalidMessageId }],
    },
    {
      code: `joi.date().iso().format({ format: DATE_FORMATS.ISO });`,
      errors: [{ messageId: invalidMessageId }],
    },
  ],
  valid: [
    `JoiValidationConstants.ISO_DATE.max('now');`,
    `JoiValidationConstants.ISO_DATE.format(['YYYY/MM/DD', ISO_DATE_FORMAT_STRING]);`,
    `joi.date().iso().format({ format: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', utc: true });`,
    `joi.date().iso().format({ format: ISO_DATE_FORMAT_STRING, utc: true });`,
    `joi.date().iso().format(['MM/DD/YYYY']);`,
    `joi.date().iso().format('YYYY-MM-DD');`,
  ],
});

describe('eslint joi-iso-date-utc rule', () => {
  it('registers RuleTester cases', () => {
    expect(joiIsoDateUtcRule.meta.messages.missingUtc).toContain('utc: true');
  });
});
