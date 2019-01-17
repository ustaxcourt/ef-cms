import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  console.log('props.docketNumber', props.docketNumber);
  const caseDetail = await applicationContext.getUseCases().getCase({
    applicationContext,
    docketNumber: props.docketNumber,
    userId: get(state.user.token),
  });
  return { caseDetail };
};
