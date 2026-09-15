import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setupContactFormAction } from '../actions/setupContactFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { canUserUpdatePetitionerAction } from '@web-client/presenter/actions/canUserUpdatePetitionerAction';
import { navigateToPathSequence } from '@web-client/presenter/sequences/navigateToPathSequence';

export const gotoContactEditSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearScreenMetadataAction,
    getCaseAction,
    canUserUpdatePetitionerAction,
    {
      yes: [setupContactFormAction, setupCurrentPageAction('ContactEdit')],
      no: [
        [
          () => ({
            path: '404',
          }),
          navigateToPathSequence,
        ],
      ],
    },
  ]);
