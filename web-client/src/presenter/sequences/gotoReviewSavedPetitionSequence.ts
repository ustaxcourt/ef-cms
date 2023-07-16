import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setContactsOnFormAction } from '../actions/setContactsOnFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoReviewSavedPetitionSequence =
  startWebSocketConnectionSequenceDecorator([
    getCaseAction,
    setCaseAction,
    setCaseOnFormAction,
    setContactsOnFormAction,
    setupCurrentPageAction('ReviewSavedPetition'),
  ]);
