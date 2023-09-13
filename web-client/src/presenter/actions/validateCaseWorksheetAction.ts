import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const validateCaseWorksheetAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { docketNumber, finalBriefDueDate, primaryIssue, statusOfMatter } = get(
    state.form,
  );

  const initialLuxonObject = applicationContext
    .getUtilities()
    .prepareDateFromString(finalBriefDueDate, FORMATS.MMDDYYYY);

  const finalBriefDueDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(initialLuxonObject, FORMATS.YYYYMMDD);

  console.log('finalBriefDueDate ', finalBriefDueDateFormatted);

  const errors = applicationContext
    .getUseCases()
    .validateCaseWorksheetInteractor({
      caseWorksheet: {
        docketNumber,
        finalBriefDueDate: finalBriefDueDateFormatted,
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
