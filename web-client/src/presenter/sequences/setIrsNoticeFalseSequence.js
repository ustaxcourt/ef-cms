import { set } from 'cerebral/factories';
import { state } from 'cerebral';

/**
 * clear IRS notice date and set hasIrsNotice to false
 * notice date values are not required if hasIrsNotice is false
 */
export const setIrsNoticeFalseSequence = [
  set(state.form.irsMonth, ''),
  set(state.form.irsDay, ''),
  set(state.form.irsYear, ''),
  set(state.caseDetail.hasVerifiedIrsNotice, false),
];
