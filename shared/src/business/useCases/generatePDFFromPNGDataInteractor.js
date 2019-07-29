const { generatePDFFromPNGs } = require('../../utilities/generatePDFFromPNGs');

/**
 * generatePDFFromPNGDataInteractor
 *
 * @param imgData // Array of Uint8Array containing img data
 */

exports.generatePDFFromPNGDataInteractor = imgData => {
  return generatePDFFromPNGs(imgData);
};
