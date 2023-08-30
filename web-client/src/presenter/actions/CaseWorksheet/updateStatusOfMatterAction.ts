export const updateStatusOfMatterAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { docketNumber, statusOfMatter } = props;

  const updatedCase = await applicationContext
    .getUseCases()
    .updateCaseWorksheetInfoInteractor(applicationContext, {
      docketNumber,
      statusOfMatter,
    });

  return { updatedCase };
};
