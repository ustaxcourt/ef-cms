import { props } from 'cerebral';
import { setWizardStepAction } from '../actions/setWizardStepAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const chooseWizardStepSequence =
  startWebSocketConnectionSequenceDecorator([
    setWizardStepAction(props.value),
  ]) as unknown as (props: { value: string }) => void;
