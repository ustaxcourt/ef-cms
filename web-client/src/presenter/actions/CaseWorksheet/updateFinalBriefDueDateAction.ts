export const updateFinalBriefDueDateAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { docketNumber, finalBriefDueDate } = props;

  const updatedCase = await applicationContext
    .getUseCases()
    .updateCaseWorksheetInteractor(applicationContext, {
      docketNumber,
      updatedProps: {
        finalBriefDueDate,
      },
    });

  return { updatedCase };
};
