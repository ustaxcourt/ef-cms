import { generateCaseConfirmationPdfUrlAction } from '../actions/CaseConfirmation/generateCaseConfirmationPdfUrlAction';
import { getCaseAction } from '../actions/getCaseAction';
import { set } from 'cerebral/factories';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { state } from 'cerebral';

export const gotoPrintableCaseConfirmationSequence = showProgressSequenceDecorator(
  [
    getCaseAction,
    setCaseAction,
    setBaseUrlAction,
    generateCaseConfirmationPdfUrlAction,
    set(state.currentPage, 'PrintableDocketRecord'),
  ],
);
