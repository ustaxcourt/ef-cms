import { TrialSessionsFilters } from '@web-client/presenter/state/trialSessionsPageState';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { parallel } from 'cerebral/factories';
import { setAllAndCurrentJudgesAction } from '../actions/setAllAndCurrentJudgesAction';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setTrialSessionsFiltersAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionsFiltersAction';
import { setTrialSessionsPageAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionsPageAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoTrialSessionsSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    clearScreenMetadataAction,
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
    setupCurrentPageAction('TrialSessions'),
  ]) as unknown as (props: ActionProps<Partial<TrialSessionsFilters>>) => void;
