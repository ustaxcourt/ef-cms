import { find, omit, pick } from 'lodash';
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
export const updateEditDocketEntryWizardDataAction = ({
  get,
  props,
  store,
}) => {
  const { INTERNAL_CATEGORY_MAP } = get(state.constants);
  let entry, form;
  const ENTRY_PROPS = ['documentType'];

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
      break;
    case 'additionalInfo':
    case 'additionalInfo2':
      if (!props.value) {
        store.unset(state.form[props.key]);
      }
      break;
  }
};
