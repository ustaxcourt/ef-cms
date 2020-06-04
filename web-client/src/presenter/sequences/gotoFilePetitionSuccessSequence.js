import { getShouldRedirectToFilePetitionSuccessAction } from '../actions/getShouldRedirectToFilePetitionSuccessAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoFilePetitionSuccessSequence = [
  getShouldRedirectToFilePetitionSuccessAction,
  {
    no: navigateToDashboardAction,
    yes: setCurrentPageAction('FilePetitionSuccess'),
  },
];
