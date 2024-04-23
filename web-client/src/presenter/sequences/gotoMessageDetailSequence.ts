import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDefaultAttachmentViewerDocumentToDisplayAction } from '../actions/getDefaultAttachmentViewerDocumentToDisplayAction';
import { getMessageThreadAction } from '../actions/getMessageThreadAction';
import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { getShouldMarkMessageAsReadAction } from '../actions/getShouldMarkMessageAsReadAction';
import { parallel } from 'cerebral';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setDefaultIsExpandedAction } from '../actions/setDefaultIsExpandedAction';
import { setMessageAction } from '../actions/setMessageAction';
import { setMessageAsReadAction } from '../actions/setMessageAsReadAction';
import { setMessageDetailViewerDocumentToDisplayAction } from '../actions/setMessageDetailViewerDocumentToDisplayAction';
import { setParentMessageIdAction } from '../actions/setParentMessageIdAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { unsetDocumentIdAction } from '../actions/unsetDocumentIdAction';

export const gotoMessageDetailSequence =
  startWebSocketConnectionSequenceDecorator(
    showProgressSequenceDecorator([
      setupCurrentPageAction('Interstitial'),
      closeMobileMenuAction,
      clearErrorAlertsAction,
      setParentMessageIdAction,
      parallel([
        [getCaseAction, setCaseAction],
        [getMessageThreadAction, setMessageAction],
      ]),
      getMostRecentMessageInThreadAction,
      getDefaultAttachmentViewerDocumentToDisplayAction,
      setMessageDetailViewerDocumentToDisplayAction,
      setDefaultIsExpandedAction,
      setCaseDetailPageTabActionGenerator('messages'),
      setupCurrentPageAction('MessageDetail'),
      getShouldMarkMessageAsReadAction,
      {
        markRead: [setMessageAsReadAction],
        noAction: [],
      },
      unsetDocumentIdAction,
    ]),
  );
