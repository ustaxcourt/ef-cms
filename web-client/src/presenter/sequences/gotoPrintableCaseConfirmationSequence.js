import { generateCaseConfirmationPdfUrlAction } from '../actions/CaseConfirmation/generateCaseConfirmationPdfUrlAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const gotoPrintableCaseConfirmationSequence =
  showProgressSequenceDecorator([
    getCaseAction,
    setCaseAction,
    generateCaseConfirmationPdfUrlAction,
    setCurrentPageAction('PrintableDocketRecord'),
  ]);
