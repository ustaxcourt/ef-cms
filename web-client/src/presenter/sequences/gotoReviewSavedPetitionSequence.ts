import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setCaseOnFormUsingStateAction } from '../actions/setCaseOnFormUsingStateAction';
import { setContactsOnFormAction } from '../actions/setContactsOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { shouldLoadCaseAction } from '../actions/shouldLoadCaseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoReviewSavedPetitionSequence =
  startWebSocketConnectionSequenceDecorator([
    shouldLoadCaseAction,
    {
      ignore: [setCaseOnFormUsingStateAction],
      load: showProgressSequenceDecorator([
        getCaseAction,
        setCaseAction,
        setCaseOnFormAction,
      ]),
    },
    setContactsOnFormAction,
    setCurrentPageAction('ReviewSavedPetition'),
  ]);
