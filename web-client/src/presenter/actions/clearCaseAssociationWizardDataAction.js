import { state } from 'cerebral';

/**
 * Clears wizard data scenario.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing scenario
 */
export const clearCaseAssociationWizardDataAction = ({ store, props }) => {
  switch (props.key) {
    case 'certificateOfService':
      store.set(state.form.certificateOfServiceDate, null);
      break;
  }
};
