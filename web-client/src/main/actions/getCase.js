import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  const caseDetail = await applicationContext.getUseCases().getCase({
    applicationContext,
    caseId: props.caseId,
    userToken: get(state.user.token),
  });
  return { caseDetail };
};
