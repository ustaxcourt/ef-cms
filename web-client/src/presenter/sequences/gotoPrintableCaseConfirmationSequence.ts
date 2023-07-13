import { generateCaseConfirmationPdfUrlAction } from '../actions/CaseConfirmation/generateCaseConfirmationPdfUrlAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPrintableCaseConfirmationSequence =
  startWebSocketConnectionSequenceDecorator(
    showProgressSequenceDecorator([
      getCaseAction,
      setCaseAction,
      generateCaseConfirmationPdfUrlAction,
      setupCurrentPageAction('PrintableDocketRecord'),
    ]),
  );
