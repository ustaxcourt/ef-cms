import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { setPractitionerDetailOnFormAction } from '../actions/Practitioners/setPractitionerDetailOnFormAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoEditPractitionerUserSequence =
  startWebSocketConnectionSequenceDecorator([
    getPractitionerDetailAction,
    setPractitionerDetailAction,
    setPractitionerDetailOnFormAction,
    setCurrentPageAction('EditPractitionerUser'),
  ]);
