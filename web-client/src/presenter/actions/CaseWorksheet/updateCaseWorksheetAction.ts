import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const updateCaseWorksheetAction = async ({
  applicationContext,
  get,
  props,
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

  const updatedWorksheet = await applicationContext
    .getUseCases()
    .updateCaseWorksheetInteractor(applicationContext, {
      worksheet: {
        docketNumber,
        finalBriefDueDate: finalBriefDueDateFormatted,
        primaryIssue,
        statusOfMatter,
      },
    });

  return { updatedWorksheet };
};
