export const updateStatusOfMatterAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { docketNumber, statusOfMatter } = props;

  const updatedCase = await applicationContext
    .getUseCases()
    .updateCaseWorksheetInteractor(applicationContext, {
      docketNumber,
      updatedProps: {
        statusOfMatter,
      },
    });

  return { updatedCase };
};
