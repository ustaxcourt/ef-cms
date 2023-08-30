export const updateSubmittedCavCaseDetailAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { docketNumber, finalBriefDueDate, statusOfMatter } = props;

  const updatedCase = await applicationContext
    .getUseCases()
    .updateCaseWorksheetInfoInteractor(applicationContext, {
      docketNumber,
      finalBriefDueDate,
      statusOfMatter,
    });

  return { updatedCase };
};
