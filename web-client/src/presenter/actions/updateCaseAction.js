import { state } from 'cerebral';

/**
 * takes the state.caseDetail and updates it via the updateCase use case.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the updateCase use case
 * @param {object} providers.get the cerebral store used for getting state.caseDetail
 * @param {object} providers.props the cerebral store used for getting props.combinedCaseDetailWithForm
 * @returns {object} the alertSuccess and the caseDetail
 */
export const updateCaseAction = async ({ applicationContext, get, props }) => {
  const { STATUS_TYPES } = get(state.constants);
  const { combinedCaseDetailWithForm } = props;
  const caseToUpdate = combinedCaseDetailWithForm || get(state.caseDetail);

  if (caseToUpdate.yearAmounts) {
    caseToUpdate.yearAmounts = caseToUpdate.yearAmounts.filter(yearAmount => {
      return yearAmount.amount || yearAmount.year;
    });
  }

  const caseDetail = await applicationContext.getUseCases().updateCase({
    applicationContext,
    caseToUpdate,
  });

  if (caseDetail.status === STATUS_TYPES.generalDocketReadyForTrial) {
    const Case = applicationContext.getEntityConstructors().Case;
    const caseEntity = new Case(caseDetail).validate();

    const caseSortTags = caseEntity.generateTrialSortTags();

    await applicationContext.getUseCases().updateCaseTrialSortTags({
      applicationContext,
      caseId: caseDetail.caseId,
      caseSortTags,
    });
  }

  return {
    alertSuccess: {
      message: `Case ${caseDetail.docketNumber} has been updated.`,
      title: 'Success',
    },
    caseDetail,
  };
};
