import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDefaultAttachmentViewerDocumentToDisplayAction } from '../actions/getDefaultAttachmentViewerDocumentToDisplayAction';
import { getJudgesCaseNoteForCaseAction } from '@web-client/presenter/actions/TrialSession/getJudgesCaseNoteForCaseAction';
import { getMessageThreadAction } from '../actions/getMessageThreadAction';
import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { getShouldMarkMessageAsReadAction } from '../actions/getShouldMarkMessageAsReadAction';
import { gotoLoginSequence } from '@web-client/presenter/sequences/Public/goToLoginSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setDefaultIsExpandedAction } from '../actions/setDefaultIsExpandedAction';
import { setJudgesCaseNoteOnCaseDetailAction } from '@web-client/presenter/actions/TrialSession/setJudgesCaseNoteOnCaseDetailAction';
import { setMessageAction } from '../actions/setMessageAction';
import { setMessageAsReadAction } from '../actions/setMessageAsReadAction';
import { setMessageDetailViewerDocumentToDisplayAction } from '../actions/setMessageDetailViewerDocumentToDisplayAction';
import { setParentMessageIdAction } from '../actions/setParentMessageIdAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { unsetDocumentIdAction } from '../actions/unsetDocumentIdAction';

const gotoMessageDetail = startWebSocketConnectionSequenceDecorator(
  showProgressSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    closeMobileMenuAction,
    clearErrorAlertsAction,
    getCaseAction,
    setCaseAction,
    getJudgesCaseNoteForCaseAction,
    setJudgesCaseNoteOnCaseDetailAction,
    setParentMessageIdAction,
    getMessageThreadAction,
    setMessageAction,
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

export const gotoMessageDetailSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoMessageDetail,
    unauthorized: [gotoLoginSequence],
  },
];
