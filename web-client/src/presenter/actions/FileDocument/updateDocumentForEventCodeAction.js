import { find, includes, omit, pick } from 'lodash';
import { state } from 'cerebral';

/**
 * clears data in the state.form based on which field is being updated
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.props the cerebral props object
 * @returns {void}
 */
export const updateDocumentForEventCodeAction = ({ get, props, store }) => {
  const { CATEGORY_MAP } = get(state.constants);
  let entry, form;
  const ENTRY_PROPS = ['category', 'documentTitle', 'documentType', 'scenario'];

  switch (props.key) {
    case 'eventCode':
      find(
        CATEGORY_MAP,
        entries => (entry = find(entries, { eventCode: props.value })),
      );
      form = {
        ...omit(get(state.form), ENTRY_PROPS),
        ...pick(entry || {}, ENTRY_PROPS),
      };
      store.set(state.form, form);
      store.unset(state.form.serviceDate);
      store.unset(state.form.trialLocation);
      store.unset(state.form.ordinalValue);
      store.unset(state.form.freeText);
      store.unset(state.form.secondaryDocument);
      break;
    case 'secondaryDocument.eventCode':
      find(
        CATEGORY_MAP,
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

      if (!props.value) {
        store.unset(state.form.secondaryDocument);
      }
      break;
  }
};
