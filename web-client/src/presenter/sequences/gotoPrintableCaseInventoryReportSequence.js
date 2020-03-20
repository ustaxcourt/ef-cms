import { generatePrintableCaseInventoryReportAction } from '../actions/CaseInventoryReport/generatePrintableCaseInventoryReportAction';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const gotoPrintableCaseInventoryReportSequence = showProgressSequenceDecorator(
  [
    setBaseUrlAction,
    generatePrintableCaseInventoryReportAction,
    setPdfPreviewUrlSequence,
    setCurrentPageAction('PrintableCaseInventoryReport'),
  ],
);
