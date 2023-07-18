import { generatePrintableCaseInventoryReportAction } from '../actions/CaseInventoryReport/generatePrintableCaseInventoryReportAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const gotoPrintableCaseInventoryReportSequence =
  showProgressSequenceDecorator([
    generatePrintableCaseInventoryReportAction,
    setPdfPreviewUrlSequence,
    setupCurrentPageAction('PrintableCaseInventoryReport'),
  ]);
