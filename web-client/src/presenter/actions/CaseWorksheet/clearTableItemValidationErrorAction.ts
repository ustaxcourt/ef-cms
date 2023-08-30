import { state } from '@web-client/presenter/app.cerebral';

export const clearTableItemValidationErrorAction = ({
  props,
  store,
}: ActionProps) => {
  const { docketNumber } = props;

  store.unset(state.tableItemValidationErrors[docketNumber]);
};
