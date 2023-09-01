import { state } from '@web-client/presenter/app.cerebral';

export const validatePrimaryIssueAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const primaryIssue = {
    ...get(state.modal),
  };

  const errors = applicationContext
    .getUseCases()
    .validateCaseWorksheetInteractor({
      caseWorksheet: { primaryIssue },
    });

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }
};
