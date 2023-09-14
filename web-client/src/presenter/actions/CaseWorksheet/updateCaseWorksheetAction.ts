import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { state } from '@web-client/presenter/app.cerebral';

export const updateCaseWorksheetAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{ updatedWorksheet: RawCaseWorksheet }> => {
  const { docketNumber, finalBriefDueDate, primaryIssue, statusOfMatter } = get(
    state.form,
  );

  const updatedWorksheet = await applicationContext
    .getUseCases()
    .updateCaseWorksheetInteractor(applicationContext, {
      worksheet: {
        docketNumber,
        finalBriefDueDate,
        primaryIssue,
        statusOfMatter,
      },
    });

  return { updatedWorksheet };
};
