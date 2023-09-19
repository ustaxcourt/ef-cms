import { state } from '@web-client/presenter/app.cerebral';

export const validateCaseWorksheetAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { docketNumber, finalBriefDueDate, primaryIssue, statusOfMatter } = get(
    state.form,
  );

  const errors = applicationContext
    .getUseCases()
    .validateCaseWorksheetInteractor({
      caseWorksheet: {
        docketNumber,
        finalBriefDueDate,
        primaryIssue,
        statusOfMatter,
      },
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
