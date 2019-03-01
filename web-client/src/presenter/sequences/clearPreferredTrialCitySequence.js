import { state } from 'cerebral';
import { set } from 'cerebral/factories';

export const clearPreferredTrialCitySequence = [
  set(state.form.preferredTrialCity, ''),
];
