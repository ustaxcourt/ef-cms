import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDefaultAttachmentViewerDocumentToDisplayAction } from '../actions/getDefaultAttachmentViewerDocumentToDisplayAction';
import { getMessageThreadAction } from '../actions/getMessageThreadAction';
import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { getShouldMarkMessageAsReadAction } from '../actions/getShouldMarkMessageAsReadAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultIsExpandedAction } from '../actions/setDefaultIsExpandedAction';
import { setMessageAction } from '../actions/setMessageAction';
import { setMessageAsReadAction } from '../actions/setMessageAsReadAction';
import { setMessageDetailViewerDocumentToDisplayAction } from '../actions/setMessageDetailViewerDocumentToDisplayAction';
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
  getDefaultAttachmentViewerDocumentToDisplayAction,
  setMessageDetailViewerDocumentToDisplayAction,
  setDefaultIsExpandedAction,
  setCaseDetailPageTabActionGenerator('messages'),
  setCurrentPageAction('MessageDetail'),
  getShouldMarkMessageAsReadAction,
  {
    markRead: [setMessageAsReadAction],
    noAction: [],
  },
]);

export const gotoMessageDetailSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoMessageDetail,
    unauthorized: [redirectToCognitoAction],
  },
];
