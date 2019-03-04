import { state } from 'cerebral';
import { set } from 'cerebral/factories';

/**
 * clear state.form.preferredTrialCity
 */
export const clearPreferredTrialCitySequence = [
  set(state.form.preferredTrialCity, ''),
];
