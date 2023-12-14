import { state } from '@web-client/presenter/app.cerebral';

export const setSelectedConsolidatedCasesToMultiDocketOnAction =
  (casesSelected: boolean) =>
  ({ store }: ActionProps) => {
    store.set(state.setSelectedConsolidatedCasesToMultiDocketOn, casesSelected);
  };
