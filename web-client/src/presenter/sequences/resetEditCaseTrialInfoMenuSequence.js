import { state } from 'cerebral';
import { unset } from 'cerebral/factories';

export const resetEditCaseTrialInfoMenuSequence = [
  unset(state.navigation.editCaseTrialInfoMenu),
];
