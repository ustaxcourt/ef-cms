import { props } from 'cerebral';
import { setWizardStepAction } from '../actions/setWizardStepAction';

export const chooseWizardStepSequence = [setWizardStepAction(props.value)];
