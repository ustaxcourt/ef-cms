import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { setPractitionerDetailOnFormAction } from '../actions/Practitioners/setPractitionerDetailOnFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoEditPractitionerUserSequence =
  startWebSocketConnectionSequenceDecorator([
    getPractitionerDetailAction,
    setPractitionerDetailAction,
    setPractitionerDetailOnFormAction,
    setupCurrentPageAction('EditPractitionerUser'),
  ]);
