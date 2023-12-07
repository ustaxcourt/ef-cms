import { clearFormAction } from '../actions/clearFormAction';
import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { gotoLoginSequence } from '@web-client/presenter/sequences/Login/goToLoginSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoPractitionerAddDocument = [
  setupCurrentPageAction('Interstitial'),
  clearFormAction,
  stopShowValidationAction,
  getPractitionerDetailAction,
  setPractitionerDetailAction,
  setupCurrentPageAction('PractitionerAddEditDocument'),
];

export const gotoPractitionerAddDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator(
      gotoPractitionerAddDocument,
    ),
    unauthorized: [gotoLoginSequence],
  },
];
