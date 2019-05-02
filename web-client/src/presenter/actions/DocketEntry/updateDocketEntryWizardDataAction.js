import { state } from 'cerebral';

/**
 * resets the state.form which is used throughout the app for storing html form values
 * state.form is used throughout the app for storing html form values
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object
 */
export const updateDocketEntryWizardDataAction = ({ store, props }) => {
  switch (props.key) {
    case 'certificateOfService':
      store.set(state.form.certificateOfServiceDate, null);
      store.set(state.form.certificateOfServiceMonth, null);
      store.set(state.form.certificateOfServiceDay, null);
      store.set(state.form.certificateOfServiceYear, null);
      break;
  }
};
