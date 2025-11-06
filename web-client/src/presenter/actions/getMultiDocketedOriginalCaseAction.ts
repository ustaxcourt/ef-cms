export const getMultiDocketedOriginalCaseAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const docketNumber = props.multiDocketedOriginalDocketNumber;
  if (docketNumber) {
    const multiDocketedOriginalCaseDetail = await applicationContext
      .getUseCases()
      .getCaseInteractor(applicationContext, {
        docketNumber,
      });

    return { multiDocketedOriginalCaseDetail };
  }
};
