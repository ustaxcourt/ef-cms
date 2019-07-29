const { generatePDFFromJPGs } = require('../../utilities/generatePDFFromJPGs');

/**
 * generatePDFFromJPGDataInteractor
 *
 * @param imgData // Array of Uint8Array containing img data
 */

exports.generatePDFFromJPGDataInteractor = imgData => {
  return generatePDFFromJPGs(imgData);
};
