import { clearModalStateAction } from '../actions/clearModalStateAction';
import { generatePractitionerCaseListPdfUrlAction } from '../actions/generatePractitionerCaseListPdfUrlAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const gotoPrintPractitionerCasesSequence = showProgressSequenceDecorator(
  [
    clearModalStateAction,
    generatePractitionerCaseListPdfUrlAction,
    setPdfPreviewUrlSequence,
    setShowModalFactoryAction('OpenPractitionerCaseListPdfModal'),
  ],
);
