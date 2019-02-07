import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  await applicationContext.getUseCases().sendPetitionToIRSHoldingQueue({
    applicationContext,
    caseId: get(state.caseDetail).caseId,
    userId: get(state.user.token),
  });
  props.docketNumber = get(state.caseDetail).docketNumber;
  return {
    alertSuccess: {
      title: 'The petition is now in the IRS Holding Queue',
    },
  };
};
