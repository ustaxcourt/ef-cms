import { state } from 'cerebral';

/**
 * takes the state.caseDetail and updates it via the updateCase use case.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the updateCase use case
 * @param {object} providers.get the cerebral store used for getting state.caseDetail
 * @param {object} providers.props the cerebral store used for getting props.formWithComputedDates
 * @returns {object} the alertSuccess and the caseDetail
 */
export const saveCaseDetailInternalEditAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { STATUS_TYPES } = applicationContext.getConstants();
  const { formWithComputedDates } = props;
  const caseToUpdate = formWithComputedDates || get(state.form);

  const caseDetail = await applicationContext
    .getUseCases()
    .saveCaseDetailInternalEditInteractor({
      applicationContext,
      caseToUpdate,
    });

  if (caseDetail.status === STATUS_TYPES.generalDocketReadyForTrial) {
    await applicationContext.getUseCases().updateCaseTrialSortTagsInteractor({
      applicationContext,
      docketNumber: caseDetail.docketNumber,
    });
  }

  return {
    alertSuccess: {
      message: `Case ${caseDetail.docketNumber} updated.`,
    },
    caseDetail,
  };
};
