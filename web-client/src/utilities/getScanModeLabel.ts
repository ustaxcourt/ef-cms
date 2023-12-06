/**
 * returns a formatted scan mode label based on the scanMode value
 *
 * @param {object} applicationContext the application context
 * @param {string} scanMode the scan mode
 * @returns {string} the prettified scan mode label
 */
export const getScanModeLabel = (applicationContext, scanMode) => {
  const { SCAN_MODE_LABELS, SCAN_MODES } = applicationContext.getConstants();
  let scanModeLabel = '';

  switch (scanMode) {
    case SCAN_MODES.FEEDER:
      scanModeLabel = SCAN_MODE_LABELS.FEEDER;
      break;
    case SCAN_MODES.FLATBED:
      scanModeLabel = SCAN_MODE_LABELS.FLATBED;
      break;
    case SCAN_MODES.DUPLEX:
      scanModeLabel = SCAN_MODE_LABELS.DUPLEX;
  }
  return scanModeLabel;
};
