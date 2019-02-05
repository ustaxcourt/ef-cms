import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  const { combinedCaseDetailWithForm } = props;
  const caseToUpdate = combinedCaseDetailWithForm || get(state.caseDetail);

  caseToUpdate.yearAmounts = caseToUpdate.yearAmounts.filter(yearAmount => {
    return yearAmount.amount || yearAmount.year;
  });

  const caseDetail = await applicationContext.getUseCases().updateCase({
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
