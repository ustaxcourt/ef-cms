export const processFilingFeePaymentAction = async ({
  applicationContext,
  props,
  path,
}: ActionProps) => {
  try {
    const result = await applicationContext
      .getUseCases()
      .processPaymentInteractor(applicationContext, {
        docketNumber: props.docketNumber,
      });

    return path.success({
      processPaymentStatus: {
        docketNumber: props.docketNumber,
        ...result,
      },
    });
  } catch (e) {
    return path.error();
  }
};
