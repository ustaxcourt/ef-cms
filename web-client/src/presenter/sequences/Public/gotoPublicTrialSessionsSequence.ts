import { FETCHED_TRIAL_SESSIONS_TIMESTAMP_KEY } from '@shared/business/entities/EntityConstants';
import { clearErrorAlertsAction } from '@web-client/presenter/actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '@web-client/presenter/actions/closeMobileMenuAction';
import { getTrialSessionsAction } from '@web-client/presenter/actions/TrialSession/getTrialSessionsAction';
import { parallel } from 'cerebral';
import { resetTrialSessionsFiltersAction } from '@web-client/presenter/actions/TrialSession/resetTrialSessionsFiltersAction';
import { setAllAndCurrentJudgesAction } from '@web-client/presenter/actions/setAllAndCurrentJudgesAction';
import { setTimeStampAction } from '@web-client/presenter/actions/TrialSession/setTimeStampAction';
import { setTrialSessionsFiltersAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionsFiltersAction';
import { setTrialSessionsPageAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionsPageAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';
import { getPublicJudgesAction } from '@web-client/presenter/actions/Public/getPublicJudgesAction';

export const gotoPublicTrialSessionsSequence = [
  setupCurrentPageAction('Interstitial'),
  resetTrialSessionsFiltersAction,
  closeMobileMenuAction,
  clearErrorAlertsAction,
  setTrialSessionsFiltersAction,
  parallel([
    [getTrialSessionsAction, setTrialSessionsPageAction],
    [getPublicJudgesAction, setAllAndCurrentJudgesAction],
  ]),
  setTimeStampAction({ propertyName: FETCHED_TRIAL_SESSIONS_TIMESTAMP_KEY }),
  setupCurrentPageAction('PublicTrialSessions'),
] as unknown as () => void;
