import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  const caseDetail = await applicationContext.getUseCases().getCase({
    applicationContext,
    docketNumber: props.docketNumber,
    userId: get(state.user.token),
  });
  return { caseDetail };
};
