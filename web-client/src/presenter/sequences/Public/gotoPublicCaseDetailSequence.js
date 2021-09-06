import { getPublicCaseAction } from '../../actions/Public/getPublicCaseAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPublicCaseDetailSequence =
  startWebSocketConnectionSequenceDecorator([
    getPublicCaseAction,
    setCaseAction,
    setCurrentPageAction('PublicCaseDetail'),
  ]);
