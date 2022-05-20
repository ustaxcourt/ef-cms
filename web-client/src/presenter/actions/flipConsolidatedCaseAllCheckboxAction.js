import { state } from 'cerebral';

/**
 * fill me in
 */
export const flipConsolidatedCaseAllCheckboxAction = ({
  get,
  props,
  store,
}) => {
  console.log('flipConsolidatedCaseAllCheckboxAction');
  console.log('props.checked', props.checked);

  const consolidatedCaseAllCheckbox = get(state.consolidatedCaseAllCheckbox);

  store.set(state.consolidatedCaseAllCheckbox, !consolidatedCaseAllCheckbox);
};
