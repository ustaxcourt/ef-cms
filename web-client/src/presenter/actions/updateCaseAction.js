import { state } from 'cerebral';

export default async ({ applicationContext, get, path, props }) => {
  const useCases = applicationContext.getUseCases();
  const { combinedCaseDetailWithForm } = props;
  const caseToUpdate = combinedCaseDetailWithForm || get(state.caseDetail);

  const caseDetail = await useCases.updateCase({
    applicationContext,
    caseToUpdate,
    userId: get(state.user.token),
  });

  return path.success({
    caseDetail: caseToUpdate,
    alertSuccess: {
      title: 'Success',
      message: `Case ${caseDetail.docketNumber} has been updated.`,
    },
  });
};
