import { getShouldRedirectToFilePetitionSuccessAction } from '../actions/getShouldRedirectToFilePetitionSuccessAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoFilePetitionSuccessSequence =
  startWebSocketConnectionSequenceDecorator([
    getShouldRedirectToFilePetitionSuccessAction,
    {
      no: navigateToDashboardAction,
      yes: setCurrentPageAction('FilePetitionSuccess'),
    },
  ]);
