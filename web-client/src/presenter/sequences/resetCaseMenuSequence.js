import { state } from 'cerebral';
import { unset } from 'cerebral/factories';

export const resetCaseMenuSequence = [unset(state.navigation.caseDetailMenu)];
