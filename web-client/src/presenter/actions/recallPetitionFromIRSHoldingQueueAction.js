import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  const useCases = applicationContext.getUseCases();

  await useCases.recallPetitionFromIRSHoldingQueue({
    caseId: get(state.caseDetail).caseId,
    applicationContext,
  });
  props.docketNumber = get(state.caseDetail).docketNumber;
  return {
    alertSuccess: {
      title: 'The petition is now recalled from the IRS Holding Queue',
    },
  };
};
