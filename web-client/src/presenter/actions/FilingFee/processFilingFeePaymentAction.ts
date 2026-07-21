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
    return path.error({
      alertError: {
        message:
          'Something went wrong when paying the filing fee. Please try again.',
        overwritable: true,
        title: 'Filing fee payment failed',
      },
    });
  }
};
