import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { state } from '@web-client/presenter/app.cerebral';

export const updateDocketEntryWorksheetAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{ updatedWorksheet: RawCaseWorksheet }> => {
  const { docketEntryId, finalBriefDueDate, primaryIssue, statusOfMatter } =
    get(state.form);

  const updatedWorksheet = await applicationContext
    .getUseCases()
    .updateDocketEntryWorksheetInteractor(applicationContext, {
      worksheet: {
        docketEntryId,
        finalBriefDueDate,
        primaryIssue,
        statusOfMatter,
      },
    });

  return { updatedWorksheet };
};
