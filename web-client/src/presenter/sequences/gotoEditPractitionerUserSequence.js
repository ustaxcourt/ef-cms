import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPractitionerDetailOnFormAction } from '../actions/Practitioners/setPractitionerDetailOnFormAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoEditPractitionerUserSequence =
  startWebSocketConnectionSequenceDecorator([
    getPractitionerDetailAction,
    setPractitionerDetailOnFormAction,
    setCurrentPageAction('EditPractitionerUser'),
  ]);
