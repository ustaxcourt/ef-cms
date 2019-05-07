import { find, omit, pick } from 'lodash';
import { state } from 'cerebral';

/**
 * clears data in the state.form based on which field is being updated
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.get the cerebral get function
 * @param {Object} providers.store the cerebral store object
 * @param {Object} providers.props the cerebral props object
 */
export const updateDocketEntryWizardDataAction = ({ get, store, props }) => {
  const { INTERNAL_CATEGORY_MAP } = get(state.constants);
  let entry, form;
  let supporting = get(state.screenMetadata.supporting);
  const ENTRY_PROPS = ['category', 'documentTitle', 'documentType', 'scenario'];

  switch (props.key) {
    case 'certificateOfService':
      store.set(state.form.certificateOfServiceDate, null);
      store.set(state.form.certificateOfServiceMonth, null);
      store.set(state.form.certificateOfServiceDay, null);
      store.set(state.form.certificateOfServiceYear, null);
      break;
    case 'eventCode':
      find(
        INTERNAL_CATEGORY_MAP,
        entries => (entry = find(entries, { eventCode: props.value })),
      );
      form = {
        ...omit(get(state.form), ENTRY_PROPS),
        ...pick(entry || {}, ENTRY_PROPS),
      };
      store.set(state.form, form);
      store.set(state.form.previousDocument, null);
      store.set(state.form.serviceDate, null);
      store.set(state.form.trialLocation, null);
      store.set(state.form.ordinalValue, null);
      store.set(state.form.freeText, null);
      store.set(state.form.secondaryDocument, null);
      break;
    case 'secondaryDocument.eventCode':
      find(
        INTERNAL_CATEGORY_MAP,
        entries => (entry = find(entries, { eventCode: props.value })),
      );
      form = {
        ...omit(get(state.form.secondaryDocument), ENTRY_PROPS),
        ...pick(entry || {}, ENTRY_PROPS),
      };
      store.set(state.form.secondaryDocument, form);
      store.set(state.form.secondaryDocument.previousDocument, null);
      store.set(state.form.secondaryDocument.serviceDate, null);
      store.set(state.form.secondaryDocument.trialLocation, null);
      store.set(state.form.secondaryDocument.ordinalValue, null);
      store.set(state.form.secondaryDocument.freeText, null);
      break;
    case 'previousDocument':
      if (supporting) {
        store.set(state.form.exhibits, null);
        store.set(state.form.attachments, null);
        store.set(state.form.certificateOfService, null);
        store.set(state.form.certificateOfServiceDate, null);
        store.set(state.form.certificateOfServiceMonth, null);
        store.set(state.form.certificateOfServiceDay, null);
        store.set(state.form.certificateOfServiceYear, null);
      }
      break;
  }
};
