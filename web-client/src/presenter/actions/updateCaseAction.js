import { state } from 'cerebral';

/**
 * takes the state.caseDetail and updates it via the updateCase use case.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context needed for getting the updateCase use case
 * @param {Object} providers.get the cerebral store used for getting state.caseDetail
 * @param {Object} providers.props the cerebral store used for getting props.combinedCaseDetailWithForm
 * @returns {Object} the alertSuccess and the caseDetail
 */
export const updateCaseAction = async ({ applicationContext, get, props }) => {
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
    alertSuccess: {
      message: `Case ${caseDetail.docketNumber} has been updated.`,
      title: 'Success',
    },
    caseDetail: caseToUpdate,
  };
};
