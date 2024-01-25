import { state } from '@web-client/presenter/app.cerebral';

export const setSelectedConsolidatedCasesToMultiDocketOnAction =
  (casesSelected: boolean) =>
  ({ get, store }: ActionProps) => {
    store.set(state.setSelectedConsolidatedCasesToMultiDocketOn, casesSelected);
    const selectedOrderCases = get(
      state.modal.form.consolidatedCasesToMultiDocketOn,
    );
    store.set(state.createOrderSelectedCases, selectedOrderCases);

    console.log(
      'sssss',
      selectedOrderCases
        .filter(aCase => aCase.checked)
        .map(aCase => aCase.docketNumberWithSuffix),
    );
    store.set(
      state.addedDocketNumbers,
      selectedOrderCases
        .filter(aCase => aCase.checked)
        .map(aCase => aCase.docketNumberWithSuffix),
    );
  };
