import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  const useCases = applicationContext.getUseCases();
  const { combinedCaseDetailWithForm } = props;
  const caseToUpdate = combinedCaseDetailWithForm || get(state.caseDetail);

  caseToUpdate.yearAmounts = caseToUpdate.yearAmounts.filter(yearAmount => {
    return yearAmount.amount || yearAmount.year;
  });

  const caseDetail = await useCases.updateCase({
    applicationContext,
    caseToUpdate,
    userId: get(state.user.token),
  });

  return {
    caseDetail: caseToUpdate,
    alertSuccess: {
      title: 'Success',
      message: `Case ${caseDetail.docketNumber} has been updated.`,
    },
  };
};
