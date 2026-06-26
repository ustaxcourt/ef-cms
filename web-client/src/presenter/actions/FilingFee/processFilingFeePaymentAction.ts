export const processFilingFeePaymentAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const result = await applicationContext
    .getUseCases()
    .processPaymentInteractor(applicationContext, {
      docketNumber: props.docketNumber,
    });

  return result;
};
