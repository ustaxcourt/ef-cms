import { state } from 'cerebral';

export default async ({ applicationContext, get, path, props }) => {
  const useCases = applicationContext.getUseCases();
  const { combinedCaseDetailWithForm } = props;

  const caseDetail = await useCases.updateCase({
    applicationContext,
    caseToUpdate: combinedCaseDetailWithForm,
    userId: get(state.user.token),
  });

  return path.success({
    caseDetail: combinedCaseDetailWithForm,
    alertSuccess: {
      title: 'Success',
      message: `Case ${caseDetail.docketNumber} has been updated.`,
    },
  });
};
