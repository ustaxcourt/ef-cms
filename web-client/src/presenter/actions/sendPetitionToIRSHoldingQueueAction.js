import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  const useCases = applicationContext.getUseCases();

  await useCases.sendPetitionToIRSHoldingQueue({
    caseId: get(state.caseDetail).caseId,
    userId: get(state.user.token),
    applicationContext,
  });
  props.docketNumber = get(state.caseDetail).docketNumber;
  return {
    alertSuccess: {
      title: 'The petition is now in the IRS Holding Queue',
    },
  };
};
