import { state } from 'cerebral';

/**
 * Clears wizard data scenario.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing scenario
 */
export const clearCaseAssociationWizardDataAction = ({ store, props }) => {
  switch (props.key) {
    case 'certificateOfService':
      store.set(state.form.certificateOfServiceDate, null);
      store.set(state.form.certificateOfServiceMonth, null);
      store.set(state.form.certificateOfServiceDay, null);
      store.set(state.form.certificateOfServiceYear, null);
      break;
    case 'documentType':
      store.set(state.form.objections, null);
      break;
  }
};
