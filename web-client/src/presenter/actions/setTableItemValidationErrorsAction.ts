import { state } from '@web-client/presenter/app.cerebral';

export const setTableItemValidationErrorsAction = ({
  props,
  store,
}: ActionProps<{
  docketNumber: string;
  errors: Record<string, string>;
}>) => {
  const { docketNumber, errors } = props;

  store.set(
    state.validationErrors.submittedCavCasesTable[docketNumber],
    errors,
  );
};
