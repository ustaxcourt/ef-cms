import { state } from 'cerebral';
import moment from 'moment';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();

  try {
    const updatedCase = await useCases.sendPetitionToIRS({
      caseId: get(state.caseDetail).caseId,
      userId: get(state.user.token),
      applicationContext,
    });
    return path.success({
      caseDetail: updatedCase,
      alertSuccess: {
        title: 'Successfully served to IRS',
        message: moment(updatedCase.irsSendDate).format('LLL'),
      },
    });
  } catch (error) {
    return path.error({
      alertError: {
        title: 'Error',
        message: error.response.data,
      },
    });
  }
};
