import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  const useCases = applicationContext.getUseCases();
  let caseDetail;
  try {
    caseDetail = await useCases.getCase({
      applicationContext,
      caseId: props.caseId,
      userToken: get(state.user.token),
    });
    return { caseDetail };
  } catch (e) {
    throw new Error('Case not found');
  }
};
