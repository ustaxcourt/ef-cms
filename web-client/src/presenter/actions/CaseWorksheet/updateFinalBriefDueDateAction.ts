export const updateFinalBriefDueDateAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { docketNumber, finalBriefDueDate } = props;

  const caseWorksheet = await applicationContext
    .getUseCases()
    .updateCaseWorksheetInteractor(applicationContext, {
      docketNumber,
      updatedProps: {
        finalBriefDueDate,
      },
    });

  return { caseWorksheet };
};
