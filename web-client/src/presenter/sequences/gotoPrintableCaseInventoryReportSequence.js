import { generatePrintableCaseInventoryReportAction } from '../actions/CaseInventoryReport/generatePrintableCaseInventoryReportAction';
import { set } from 'cerebral/factories';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { state } from 'cerebral';

export const gotoPrintableCaseInventoryReportSequence = showProgressSequenceDecorator(
  [
    setBaseUrlAction,
    generatePrintableCaseInventoryReportAction,
    setPdfPreviewUrlSequence,
    set(state.currentPage, 'PrintableCaseInventoryReport'),
  ],
);
