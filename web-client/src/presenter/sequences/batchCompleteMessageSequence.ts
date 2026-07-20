import { batchCompleteMessageAction } from '../actions/batchCompleteMessageAction';
import { clearModalAction } from '@web-client/presenter/actions/clearModalAction';
import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
import { clearScreenMetadataAction } from '@web-client/presenter/actions/clearScreenMetadataAction';
import { clearUsersAction } from '@web-client/presenter/actions/clearUsersAction';
import { getMessagePageAction } from '@web-client/presenter/actions/getMessagePageAction';
import { getMessageThreadAction } from '@web-client/presenter/actions/getMessageThreadAction';
import { getMostRecentMessageInThreadAction } from '@web-client/presenter/actions/getMostRecentMessageInThreadAction';
import { moveDocketClerkReportMessagesToCompletedAction } from '@web-client/presenter/actions/DocketClerkReport/moveDocketClerkReportMessagesToCompletedAction';
import { removeCompletedMessagesFromDisplayAction } from '../actions/removeCompletedMessagesFromDisplayAction';
import { resetCacheKeyAction } from '@web-client/presenter/actions/resetCacheKeyAction';
import { resetSelectedMessageAction } from '../actions/Messages/resetSelectedMessageAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setCompleteMessageAlertAction } from '../actions/Messages/setCompleteMessageAlertAction';
import { setMessageAction } from '@web-client/presenter/actions/setMessageAction';
import { setWaitingForResponseAction } from '@web-client/presenter/actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';

export const batchCompleteMessageSequence = [
  setWaitingForResponseAction,
  batchCompleteMessageAction,
];

export const completeMessageSuccessSequence = [
  getMessagePageAction,
  {
    detail: [
      clearScreenMetadataAction,
      clearUsersAction,
      clearModalAction,
      clearModalStateAction,
      getMostRecentMessageInThreadAction,
      getMessageThreadAction,
      setMessageAction,
    ],
    // The report renders another clerk's boxes from state.docketClerkReport, so
    // move the rows there rather than in the logged-in user's own message list.
    docketClerkReport: [
      moveDocketClerkReportMessagesToCompletedAction,
      resetSelectedMessageAction,
    ],
    inbox: [
      setCompleteMessageAlertAction,
      removeCompletedMessagesFromDisplayAction,
      resetCacheKeyAction,
      resetSelectedMessageAction,
    ],
  },
  unsetWaitingForResponseAction,
] as unknown as () => {};

export const completeMessageErrorSequence = [
  setAlertErrorAction,
  unsetWaitingForResponseAction,
] as unknown as () => {};
