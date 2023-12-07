import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { gotoLoginSequence } from '@web-client/presenter/sequences/Public/goToLoginSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { setupContactFormAction } from '../actions/setupContactFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoContactEdit = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setupContactFormAction,
  setupCurrentPageAction('ContactEdit'),
]);

export const gotoContactEditSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoContactEdit,
    unauthorized: [gotoLoginSequence],
  },
];
