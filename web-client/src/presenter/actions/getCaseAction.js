export default async ({ applicationContext, props }) => {
  const caseDetail = await applicationContext.getUseCases().getCase({
    applicationContext,
    docketNumber: props.docketNumber,
  });

  return { caseDetail };
};
