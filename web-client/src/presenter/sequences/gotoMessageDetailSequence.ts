import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDefaultAttachmentViewerDocumentToDisplayAction } from '../actions/getDefaultAttachmentViewerDocumentToDisplayAction';
import { getJudgesCaseNoteForCaseAction } from '@web-client/presenter/actions/TrialSession/getJudgesCaseNoteForCaseAction';
import { getMessageThreadAction } from '../actions/getMessageThreadAction';
import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { getShouldMarkMessageAsReadAction } from '../actions/getShouldMarkMessageAsReadAction';
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
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { takePathForRoles } from './takePathForRoles';
import { getConstants } from '@web-client/getConstants';

const { USER_ROLES } = getConstants();

export const gotoMessageDetailSequence =
  startWebSocketConnectionSequenceDecorator(
    showProgressSequenceDecorator([
      setupCurrentPageAction('Interstitial'),
      closeMobileMenuAction,
      clearErrorAlertsAction,
      getCaseAction,
      setCaseAction,
      runPathForUserRoleAction,
      {
        ...takePathForRoles(
          [
            USER_ROLES.chambers,
            USER_ROLES.judge
          ],
          [
            getJudgesCaseNoteForCaseAction,
            setJudgesCaseNoteOnCaseDetailAction
          ]
        ),
        ...takePathForRoles(
          [
            USER_ROLES.adc,
            USER_ROLES.admin,
            USER_ROLES.admissionsClerk,
            USER_ROLES.clerkOfCourt,
            USER_ROLES.docketClerk,
            USER_ROLES.caseServicesSupervisor,
            USER_ROLES.floater,
            USER_ROLES.general,
            USER_ROLES.petitionsClerk,
            USER_ROLES.reportersOffice,
            USER_ROLES.trialClerk,
          ],
          [],
        ),
      },
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
