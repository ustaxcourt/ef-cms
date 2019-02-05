import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  await applicationContext.getUseCases().recallPetitionFromIRSHoldingQueue({
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
