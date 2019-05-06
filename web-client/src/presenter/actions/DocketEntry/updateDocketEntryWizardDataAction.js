import { find, omit, pick } from 'lodash';
import { state } from 'cerebral';

/**
 * resets the state.form which is used throughout the app for storing html form values
 * state.form is used throughout the app for storing html form values
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object
 */
export const updateDocketEntryWizardDataAction = ({ get, store, props }) => {
  const { INTERNAL_CATEGORY_MAP } = get(state.constants);
  let entry, form;
  let supporting = get(state.screenMetadata.supporting);
  const ENTRY_PROPS = ['category', 'documentTitle', 'documentType', 'scenario'];

  switch (props.key) {
    case 'certificateOfService':
      store.unset(state.form.certificateOfServiceDate);
      store.unset(state.form.certificateOfServiceMonth);
      store.unset(state.form.certificateOfServiceDay);
      store.unset(state.form.certificateOfServiceYear);
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
      if (!supporting) {
        store.unset(state.form.previousDocument);
      }
      store.unset(state.form.serviceDate);
      store.unset(state.form.trialLocation);
      store.unset(state.form.ordinalValue);
      store.unset(state.form.freeText);
      store.unset(state.form.secondaryDocument);
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
      store.unset(state.form.secondaryDocument.previousDocument);
      store.unset(state.form.secondaryDocument.serviceDate);
      store.unset(state.form.secondaryDocument.trialLocation);
      store.unset(state.form.secondaryDocument.ordinalValue);
      store.unset(state.form.secondaryDocument.freeText);
      break;
    case 'previousDocument':
      if (supporting) {
        store.unset(state.form.exhibits);
        store.unset(state.form.attachments);
        store.unset(state.form.certificateOfService);
        store.unset(state.form.certificateOfServiceDate);
        store.unset(state.form.certificateOfServiceMonth);
        store.unset(state.form.certificateOfServiceDay);
        store.unset(state.form.certificateOfServiceYear);
      }
      break;
  }
};
