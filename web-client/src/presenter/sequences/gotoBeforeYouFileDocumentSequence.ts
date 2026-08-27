import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { getCaseAssociationAction } from '@web-client/presenter/actions/getCaseAssociationAction';
import { isUserAssociatedWithTrialSessionAction } from '@web-client/presenter/actions/isUserDirectlyAssociatedToCaseAction';
import { navigateToPathSequence } from '@web-client/presenter/sequences/navigateToPathSequence';

export const gotoBeforeYouFileDocumentSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    getCaseAction,
    setCaseAction,
    getCaseAssociationAction,
    isUserAssociatedWithTrialSessionAction,
    {
      yes: [setupCurrentPageAction('BeforeYouFileADocument')],
      no: [
        () => ({
          path: '404',
        }),
        navigateToPathSequence,
      ],
    },
  ]);
