import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export default [
  set(state.submitting, false),
  set(state.alertError, { title: 'Oh No', message: 'Mr. Bill' }),
];
