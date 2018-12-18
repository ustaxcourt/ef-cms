import { state } from 'cerebral';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();

  const caseDetail = await useCases.updateCase({
    applicationContext,
    caseToUpdate: get(state.caseDetail),
    userId: get(state.user.token),
  });

  return path.success({
    caseDetail,
    alertSuccess: {
      title: 'Success',
      message: `Case ${caseDetail.docketNumber} has been updated.`,
    },
  });
};
