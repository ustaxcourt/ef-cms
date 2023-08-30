export const updateFinalBriefDueDateAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { docketNumber, finalBriefDueDate } = props;

  const updatedCase = await applicationContext
    .getUseCases()
    .updateCaseWorksheetInfoInteractor(applicationContext, {
      docketNumber,
      finalBriefDueDate,
    });

  return { updatedCase };
};
