import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { state } from '@web-client/presenter/app.cerebral';

export const updateDocketEntryWorksheetAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{ updatedWorksheet: RawDocketEntryWorksheet }> => {
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
