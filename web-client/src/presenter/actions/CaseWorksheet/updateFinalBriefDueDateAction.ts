export const updateFinalBriefDueDateAction = async ({
  applicationContext,
  props,
}: ActionProps<{ docketNumber: string; finalBriefDueDate: string }>) => {
  const { docketNumber, finalBriefDueDate } = props;

  const updatedWorksheet = await applicationContext
    .getUseCases()
    .updateCaseWorksheetInteractor(applicationContext, {
      docketNumber,
      updatedProps: {
        finalBriefDueDate,
      },
    });

  return { updatedWorksheet };
};
