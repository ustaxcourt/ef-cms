/**
 * returns a formatted scan mode label based on the scanMode value
 *
 * @param {object} providers the providers object
 * @param {Function} providers.scanMode the scan mode
 * @returns {string} the prettified scan mode label
 *
 */

export default scanMode => {
  let scanModeLabel = '';

  switch (scanMode) {
    case 'feeder':
      scanModeLabel = 'Single Sided';
      break;
    case 'flatbed':
      scanModeLabel = 'Flatbed';
      break;
    case 'duplex':
      scanModeLabel = 'Double Sided';
  }
  return scanModeLabel;
};
