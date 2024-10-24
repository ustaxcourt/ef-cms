import { TrialSessionsFilters } from '@web-client/presenter/state/trialSessionsPageState';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getBulkSpecialTrialSessionCopyNotesAction } from '../actions/TrialSession/getBulkSpecialTrialSessionCopyNotesAction';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { parallel } from 'cerebral/factories';
import { resetTrialSessionsFiltersAction } from '@web-client/presenter/actions/TrialSession/resetTrialSessionsFiltersAction';
import { setAllAndCurrentJudgesAction } from '../actions/setAllAndCurrentJudgesAction';
import { setBulkSpecialTrialSessionCopyNotesAction } from '../actions/TrialSession/setBulkSpecialTrialSessionCopyNotesAction';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setTrialSessionsFiltersAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionsFiltersAction';
import { setTrialSessionsPageAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionsPageAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoTrialSessionsSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    resetTrialSessionsFiltersAction,
    closeMobileMenuAction,
    clearErrorAlertsAction,
    setTrialSessionsFiltersAction,
    parallel([
      [getJudgeForCurrentUserAction, setJudgeUserAction],
      [getNotificationsAction, setNotificationsAction],
      [getTrialSessionsAction, setTrialSessionsPageAction],
      [
        getUsersInSectionAction({ section: 'judge' }),
        setAllAndCurrentJudgesAction,
      ],
    ]),
    [
      getBulkSpecialTrialSessionCopyNotesAction,
      setBulkSpecialTrialSessionCopyNotesAction,
    ],
    setupCurrentPageAction('TrialSessions'),
  ]) as unknown as (props: ActionProps<Partial<TrialSessionsFilters>>) => void;
