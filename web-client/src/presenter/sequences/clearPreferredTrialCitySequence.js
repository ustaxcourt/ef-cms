import { set } from 'cerebral/factories';
import { state } from 'cerebral';

/**
 * clear state.form.preferredTrialCity
 */
export const clearPreferredTrialCitySequence = [
  set(state.form.preferredTrialCity, ''),
];
