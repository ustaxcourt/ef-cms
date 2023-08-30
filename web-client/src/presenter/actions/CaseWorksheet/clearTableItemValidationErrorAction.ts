import { state } from '@web-client/presenter/app.cerebral';

export const clearTableItemValidationErrorAction = ({
  props,
  store,
}: ActionProps) => {
  const { docketNumber, validationKey } = props;

  store.unset(
    state.validationErrors.submittedCavCasesTable[docketNumber][validationKey],
  );
};
