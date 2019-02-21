import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export default [
  set(state.form.irsMonth, ''),
  set(state.form.irsDay, ''),
  set(state.form.irsYear, ''),
  set(state.caseDetail.yearAmounts, []),
  set(state.caseDetail.hasIrsNotice, false),
];
