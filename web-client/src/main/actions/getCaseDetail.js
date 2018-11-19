import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  const useCases = applicationContext.getUseCases();
  const caseDetail = await useCases.getCaseDetail(
    applicationContext,
    props.caseId,
    get(state.user.userId),
  );
  return { caseDetail };
};
