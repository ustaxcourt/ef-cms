import { state } from '@web-client/presenter/app.cerebral';

/**
 * saves the selected docket numbers to a location in state to be reloaded in the future.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.user
 * @param {object} providers.props the cerebral props object used for getting the props.user
 */
export const saveSelectedDocketNumbersAction = ({
  get,
  store,
}: ActionProps) => {
  const consolidatedCases = get(
    state.modal.form.consolidatedCasesToMultiDocketOn,
  );

  const checkedCases = consolidatedCases
    .filter(consolidatedCase => consolidatedCase.checked)
    .map(consolidatedCase => consolidatedCase.docketNumberWithSuffix);

  store.set(state.addedDocketNumbers, checkedCases);
};
