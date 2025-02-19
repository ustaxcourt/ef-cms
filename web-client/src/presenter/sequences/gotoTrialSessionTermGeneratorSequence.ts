import { checkIfTermInfoIsInStateAction } from '@web-client/presenter/actions/TrialSession/TermGenerator/checkIfTermInfoIsInStateAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { gotoTrialSessionsSequence } from '@web-client/presenter/sequences/gotoTrialSessionsSequence';
import { navigateToTrialSessionsAction } from '@web-client/presenter/actions/TrialSession/navigateToTrialSessionsAction';

export const gotoTrialSessionTermGeneratorSequence = [
  setupCurrentPageAction('Interstitial'),
  checkIfTermInfoIsInStateAction,
  {
    doesNotExist: [navigateToTrialSessionsAction, gotoTrialSessionsSequence],
    exist: [setupCurrentPageAction('TrialSessionTermGeneratorView')],
  },
] as unknown as () => void;
