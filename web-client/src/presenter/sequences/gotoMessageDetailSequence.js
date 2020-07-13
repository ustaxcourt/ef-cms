import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDefaultAttachmentToDisplayAction } from '../actions/getDefaultAttachmentToDisplayAction';
import { getMessageThreadAction } from '../actions/getMessageThreadAction';
import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setAttachmentDocumentToDisplayAction } from '../actions/setAttachmentDocumentToDisplayAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultIsExpandedAction } from '../actions/setDefaultIsExpandedAction';
import { setMessageAction } from '../actions/setMessageAction';
import { setParentMessageIdAction } from '../actions/setParentMessageIdAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

const gotoMessageDetail = showProgressSequenceDecorator([
  setCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  clearErrorAlertsAction,
  getCaseAction,
  setCaseAction,
  setParentMessageIdAction,
  getMessageThreadAction,
  setMessageAction,
  getMostRecentMessageInThreadAction,
  getDefaultAttachmentToDisplayAction,
  setAttachmentDocumentToDisplayAction,
  setDefaultIsExpandedAction,
  setCurrentPageAction('MessageDetail'),
]);

export const gotoMessageDetailSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoMessageDetail,
    unauthorized: [redirectToCognitoAction],
  },
];
