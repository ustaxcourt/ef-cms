import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDefaultAttachmentToDisplayAction } from '../actions/getDefaultAttachmentToDisplayAction';
import { getMessageAction } from '../actions/getMessageAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setAttachmentDocumentToDisplayAction } from '../actions/setAttachmentDocumentToDisplayAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setMessageAction } from '../actions/setMessageAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

const gotoMessageDetail = showProgressSequenceDecorator([
  setCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  clearErrorAlertsAction,
  getCaseAction,
  setCaseAction,
  getMessageAction,
  setMessageAction,
  getDefaultAttachmentToDisplayAction,
  setAttachmentDocumentToDisplayAction,
  setCurrentPageAction('MessageDetail'),
]);

export const gotoMessageDetailSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoMessageDetail,
    unauthorized: [redirectToCognitoAction],
  },
];
