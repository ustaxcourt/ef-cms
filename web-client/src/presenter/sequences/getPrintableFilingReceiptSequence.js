import { generatePrintableFilingReceiptAction } from '../actions/FileDocument/generatePrintableFilingReceiptAction';
import { getShouldGeneratePrintableFilingReceiptAction } from '../actions/FileDocument/getShouldGeneratePrintableFilingReceiptAction';

export const getPrintableFilingReceiptSequence = [
  getShouldGeneratePrintableFilingReceiptAction,
  {
    false: [],
    true: [generatePrintableFilingReceiptAction],
  },
];
