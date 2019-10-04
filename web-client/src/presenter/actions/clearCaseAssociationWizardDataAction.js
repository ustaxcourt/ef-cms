import { state } from 'cerebral';

/**
 * Clears wizard data scenario.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing scenario
 */
export const clearCaseAssociationWizardDataAction = ({ props, store }) => {
  switch (props.key) {
    case 'certificateOfService':
      store.unset(state.form.certificateOfServiceDate);
      store.unset(state.form.certificateOfServiceMonth);
      store.unset(state.form.certificateOfServiceDay);
      store.unset(state.form.certificateOfServiceYear);
      break;
    case 'documentType':
      store.unset(state.form.objections);
      store.unset(state.form.supportingDocumentMetadata);
      if (!props.value) {
        store.unset(state.form.documentTitleTemplate);
        store.unset(state.form.documentType);
        store.unset(state.form.eventCode);
        store.unset(state.form.scenario);
      }
      break;
  }
};
