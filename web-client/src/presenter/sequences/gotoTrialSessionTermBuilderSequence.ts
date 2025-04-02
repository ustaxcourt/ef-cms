import { checkIfTermInfoIsInStateAction } from '@web-client/presenter/actions/TrialSession/TermBuilder/checkIfTermInfoIsInStateAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { gotoTrialSessionsSequence } from '@web-client/presenter/sequences/gotoTrialSessionsSequence';
import { navigateToTrialSessionsAction } from '@web-client/presenter/actions/TrialSession/navigateToTrialSessionsAction';

export const gotoTrialSessionTermBuilderSequence = [
  setupCurrentPageAction('Interstitial'),
  checkIfTermInfoIsInStateAction,
  {
    doesNotExist: [navigateToTrialSessionsAction, gotoTrialSessionsSequence],
    exist: [setupCurrentPageAction('TermBuilderView')],
  },
] as unknown as () => void;
