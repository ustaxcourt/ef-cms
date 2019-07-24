import { set } from 'cerebral/factories';
import { state } from 'cerebral';

/**
 * clear IRS notice date, year/amount values, and set
 * hasIrsNotice to false - notice date and year/amount
 * values are not required if hasIrsNotice is false
 */
export const setIrsNoticeFalseSequence = [
  set(state.form.irsMonth, ''),
  set(state.form.irsDay, ''),
  set(state.form.irsYear, ''),
  set(state.caseDetail.yearAmounts, []),
  set(state.caseDetail.hasVerifiedIrsNotice, false),
];
