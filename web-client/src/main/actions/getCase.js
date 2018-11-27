import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  const useCases = applicationContext.getUseCases();
  const caseDetail = await useCases.getCase({
    applicationContext,
    caseId: props.caseId,
    userToken: get(state.user.token),
  });
  return { caseDetail };
};
