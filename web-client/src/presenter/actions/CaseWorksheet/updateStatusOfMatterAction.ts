export const updateStatusOfMatterAction = async ({
  applicationContext,
  props,
}: ActionProps<{
  docketNumber: string;
  statusOfMatter: string;
}>) => {
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
