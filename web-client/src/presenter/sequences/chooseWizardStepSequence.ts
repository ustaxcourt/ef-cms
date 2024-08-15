import { props } from '../../utilities/cerebralWrapper';
import { setWizardStepAction } from '../actions/setWizardStepAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const chooseWizardStepSequence =
  startWebSocketConnectionSequenceDecorator([setWizardStepAction(props.value)]);
