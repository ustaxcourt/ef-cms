import { caseExistsAction } from '../actions/caseExistsAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { set } from 'cerebral/factories';
import { setCaseIdFromSearchAction } from '../actions/setCaseIdFromSearchAction';
import { state } from 'cerebral';

export const submitCaseSearchSequence = [
  setCaseIdFromSearchAction,
  caseExistsAction,
  {
    error: [set(state.form.searchError, true)],
    success: [set(state.form.searchError, false), navigateToCaseDetailAction],
  },
];
