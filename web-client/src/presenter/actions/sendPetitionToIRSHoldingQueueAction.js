import { state } from 'cerebral';
import moment from 'moment';

export default async ({ applicationContext, get, props }) => {
  const useCases = applicationContext.getUseCases();

  const irsSendDate = await useCases.sendPetitionToIRSHoldingQueue({
    caseId: get(state.caseDetail).caseId,
    userId: get(state.user.token),
    applicationContext,
  });
  props.docketNumber = get(state.caseDetail).docketNumber;
  return {
    alertSuccess: {
      title: 'The petition is now in the IRS Holding Queue',
      message: moment(irsSendDate).format('L LT'),
    },
  };
};
