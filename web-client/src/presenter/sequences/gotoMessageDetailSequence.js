import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getConstants } from '../../getConstants';
import { getDefaultAttachmentViewerDocumentToDisplayAction } from '../actions/getDefaultAttachmentViewerDocumentToDisplayAction';
import { getFeatureFlagValueFactoryAction } from '../actions/getFeatureFlagValueFactoryAction';
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
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { unsetDocumentIdAction } from '../actions/unsetDocumentIdAction';

const gotoMessageDetail = startWebSocketConnectionSequenceDecorator(
  showProgressSequenceDecorator([
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
    getFeatureFlagValueFactoryAction(
      getConstants().ALLOWLIST_FEATURE_FLAGS.STAMP_DISPOSITION,
      true,
    ),
    setDefaultIsExpandedAction,
    setCaseDetailPageTabActionGenerator('messages'),
    setCurrentPageAction('MessageDetail'),
    getShouldMarkMessageAsReadAction,
    {
      markRead: [setMessageAsReadAction],
      noAction: [],
    },
    unsetDocumentIdAction,
  ]),
);

export const gotoMessageDetailSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoMessageDetail,
    unauthorized: [redirectToCognitoAction],
  },
];
