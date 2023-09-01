export const updateStatusOfMatterAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { docketNumber, statusOfMatter } = props;

  const updatedWorksheet = await applicationContext
    .getUseCases()
    .updateCaseWorksheetInteractor(applicationContext, {
      docketNumber,
      updatedProps: {
        statusOfMatter,
      },
    });

  return { updatedWorksheet };
};
