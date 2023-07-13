import { clearFormAction } from '../actions/clearFormAction';
import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoPractitionerAddDocument = [
  setCurrentPageAction('Interstitial'),
  clearFormAction,
  stopShowValidationAction,
  getPractitionerDetailAction,
  setPractitionerDetailAction,
  setCurrentPageAction('PractitionerAddEditDocument'),
];

export const gotoPractitionerAddDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator(
      gotoPractitionerAddDocument,
    ),
    unauthorized: [redirectToCognitoAction],
  },
];
