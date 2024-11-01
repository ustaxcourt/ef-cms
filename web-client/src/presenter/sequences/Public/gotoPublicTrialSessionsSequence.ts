import { clearErrorAlertsAction } from '@web-client/presenter/actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '@web-client/presenter/actions/closeMobileMenuAction';
import { getTrialSessionsAction } from '@web-client/presenter/actions/TrialSession/getTrialSessionsAction';
import { getUsersInSectionAction } from '@web-client/presenter/actions/getUsersInSectionAction';
import { parallel } from 'cerebral';
import { resetTrialSessionsFiltersAction } from '@web-client/presenter/actions/TrialSession/resetTrialSessionsFiltersAction';
import { setAllAndCurrentJudgesAction } from '@web-client/presenter/actions/setAllAndCurrentJudgesAction';
import { setTimeStampAction } from '@web-client/presenter/actions/TrialSession/setTimeStampAction';
import { setTrialSessionsFiltersAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionsFiltersAction';
import { setTrialSessionsPageAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionsPageAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';

export const gotoPublicTrialSessionsSequence = [
  setupCurrentPageAction('Interstitial'),
  resetTrialSessionsFiltersAction,
  closeMobileMenuAction,
  clearErrorAlertsAction,
  setTrialSessionsFiltersAction,
  parallel([
    [getTrialSessionsAction, setTrialSessionsPageAction],
    [
      getUsersInSectionAction({ section: 'judge' }),
      setAllAndCurrentJudgesAction,
    ],
  ]),
  setTimeStampAction({ propertyName: 'FetchedTrialSessions' }),
  setupCurrentPageAction('PublicTrialSessions'),
] as unknown as () => void;
