import { chooseStartCaseWizardStepAction } from '../actions/chooseStartCaseWizardStepAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const chooseStartCaseWizardStepSequence =
  startWebSocketConnectionSequenceDecorator([chooseStartCaseWizardStepAction]);
