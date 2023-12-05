import { state } from '@web-client/presenter/app.cerebral';

export const validateDocketEntryWorksheetAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { docketEntryId, finalBriefDueDate, primaryIssue, statusOfMatter } =
    get(state.form);

  const errors = applicationContext
    .getUseCases()
    .validateDocketEntryWorksheetInteractor({
      docketEntryWorksheet: {
        docketEntryId,
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
