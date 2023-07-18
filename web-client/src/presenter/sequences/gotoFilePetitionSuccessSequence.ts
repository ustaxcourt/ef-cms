import { getShouldRedirectToFilePetitionSuccessAction } from '../actions/getShouldRedirectToFilePetitionSuccessAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoFilePetitionSuccessSequence =
  startWebSocketConnectionSequenceDecorator([
    getShouldRedirectToFilePetitionSuccessAction,
    {
      no: navigateToDashboardAction,
      yes: setupCurrentPageAction('FilePetitionSuccess'),
    },
  ]);
