import { state } from '@web-client/presenter/app.cerebral';

export const setCreateOrderSelectedCasesAction = ({
  get,
  store,
}: ActionProps) => {
  const selectedOrderCases = get(
    state.modal.form.consolidatedCasesToMultiDocketOn,
  );

  store.set(state.createOrderSelectedCases, selectedOrderCases);
  store.set(
    state.addedDocketNumbers,
    selectedOrderCases
      .filter(aCase => aCase.checked)
      .map(aCase => aCase.docketNumberWithSuffix),
  );
};
