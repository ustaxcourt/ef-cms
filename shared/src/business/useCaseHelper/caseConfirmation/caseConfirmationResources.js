const fs = require('fs');

// eslint-disable-next-line spellcheck/spell-checker
/**
 * For the files below to be properly bundled by parcel, the first argument to
 * `fs.readFileSync` must be a string literal path (not composed with path.resolve
 * or using `__dirname` or anything like that). The path must be relative to the
 * project root from where parcel is run.
 */

const confirmSassContent = fs.readFileSync(
  './shared/src/business/useCaseHelper/caseConfirmation/caseConfirmation.scss',
  'utf8',
);
const confirmTemplateContent = fs.readFileSync(
  './shared/src/business/useCaseHelper/caseConfirmation/caseConfirmation.handlebars',
  'utf8',
);
const ustcLogoBufferBase64 =
  'data:image/png;base64,' +
  fs.readFileSync('./shared/static/images/ustc_seal.png', {
    encoding: 'base64',
  });

module.exports = {
  confirmSassContent,
  confirmTemplateContent,
  ustcLogoBufferBase64,
};
