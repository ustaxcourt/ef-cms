import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const validateCaseWorksheetAction = ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const { docketNumber, primaryIssue, statusOfMatter } = get(state.form);

  console.log(props.computedDate, '&&&&');

  const finalBriefDueDate = applicationContext
    .getUtilities()
    .formatDateString(props.computedDate, FORMATS.YYYYMMDD);

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
