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
      break;
  }
};
