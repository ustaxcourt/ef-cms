import { generatePrintableCaseInventoryReportAction } from '../actions/CaseInventoryReport/generatePrintableCaseInventoryReportAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const gotoPrintableCaseInventoryReportSequence =
  showProgressSequenceDecorator([
    generatePrintableCaseInventoryReportAction,
    setPdfPreviewUrlSequence,
    setCurrentPageAction('PrintableCaseInventoryReport'),
  ]);
