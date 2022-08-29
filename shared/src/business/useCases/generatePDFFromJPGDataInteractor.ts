import { generatePDFFromJPGs } from '../utilities/generatePDFFromJPGs';

/**
 * generatePDFFromJPGDataInteractor
 *
 * @param imgData // Array of Uint8Array containing img data
 */

export const generatePDFFromJPGDataInteractor = (
  applicationContext: IApplicationContext,
  { imgData }: { imgData: any },
) => {
  return generatePDFFromJPGs(applicationContext, { imgData });
};
