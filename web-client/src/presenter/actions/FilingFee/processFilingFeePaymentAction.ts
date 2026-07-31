export const processFilingFeePaymentAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  try {
    const result = await applicationContext
      .getUseCases()
      .processPaymentInteractor(applicationContext, {
        docketNumber: props.docketNumber,
      });

    return {
      processPaymentStatus: {
        docketNumber: props.docketNumber,
        ...result,
      },
    };
  } catch (e) {
    return {
      processPaymentStatus: {
        docketNumber: props.docketNumber,
        paymentStatus: 'unknown',
      },
    };
  }
};
