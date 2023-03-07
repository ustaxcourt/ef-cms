const ordinals = require('english-ordinals');

/**
 * Transforms a form value as a string into an ordinal, in title case
 *
 * @param  {string} formValue the formValue to transform
 * @returns {string|void} the formValue as an ordinal in title case
 */
const transformFormValueToTitleCaseOrdinal = formValue => {
  return ordinals
    .getOrdinal(Number(formValue))
    .split(' ')
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};
exports.transformFormValueToTitleCaseOrdinal =
  transformFormValueToTitleCaseOrdinal;
