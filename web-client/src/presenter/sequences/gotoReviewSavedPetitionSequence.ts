import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setContactsOnFormAction } from '../actions/setContactsOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoReviewSavedPetitionSequence =
  startWebSocketConnectionSequenceDecorator([
    getCaseAction,
    setCaseAction,
    setCaseOnFormAction,
    setContactsOnFormAction,
    setCurrentPageAction('ReviewSavedPetition'),
  ]);
