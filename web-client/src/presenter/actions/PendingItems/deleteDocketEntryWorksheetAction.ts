export const deleteDocketEntryWorksheetAction = async ({
  applicationContext,
  props,
}: ActionProps<{ docketEntryId: string }>) => {
  const { docketEntryId } = props;
  await applicationContext
    .getUseCases()
    .deleteDocketEntryWorksheetInteractor(applicationContext, {
      docketEntryId,
    });

  return props;
};
