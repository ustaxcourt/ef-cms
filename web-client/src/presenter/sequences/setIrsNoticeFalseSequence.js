import { set } from 'cerebral/factories';
import { state } from 'cerebral';

/**
 * clear IRS notice date, year/amount values, and set hasIrsNotice to false
 */
export default [
  set(state.form.irsMonth, ''),
  set(state.form.irsDay, ''),
  set(state.form.irsYear, ''),
  set(state.caseDetail.yearAmounts, []),
  set(state.caseDetail.hasIrsNotice, false),
];
