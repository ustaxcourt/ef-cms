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
  const consolidatedCaseAllCheckbox = get(state.consolidatedCasesEnabled) || [];
  const newEnabled = consolidatedCaseAllCheckbox.map(consolidatedCase => {
    return {
      ...consolidatedCase,
      enabled: !consolidatedCase.enabled,
    };
  });
  store.set(state.consolidatedCaseAllCheckbox, newEnabled);
};
