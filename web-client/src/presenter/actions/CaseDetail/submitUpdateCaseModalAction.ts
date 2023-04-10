import { state } from 'cerebral';

/**
 * Updates the case caption and case status
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the get function
 * @returns {object} the updated case as caseDetail
 */
export const submitUpdateCaseModalAction = async ({
  applicationContext,
  get,
}) => {
  const { STATUS_TYPES_WITH_ASSOCIATED_JUDGE } =
    applicationContext.getConstants();

  const caseToUpdate = get(state.caseDetail);

  const { associatedJudge, caseCaption, caseStatus } = get(state.modal);

  let judgeUserId = associatedJudge;
  if (!STATUS_TYPES_WITH_ASSOCIATED_JUDGE.includes(caseStatus)) {
    judgeUserId = undefined;
  }

  let updatedCase = caseToUpdate;

  if (
    (caseStatus && caseToUpdate.status !== caseStatus) ||
    (judgeUserId && caseToUpdate.judgeUserId !== judgeUserId) ||
    (caseCaption && caseToUpdate.caseCaption !== caseCaption)
  ) {
    updatedCase = await applicationContext
      .getUseCases()
      .updateCaseContextInteractor(applicationContext, {
        caseCaption,
        caseStatus,
        docketNumber: caseToUpdate.docketNumber,
        judgeUserId,
      });
  }

  return {
    alertSuccess: {
      message: 'Changes saved.',
    },
    caseDetail: updatedCase,
  };
};
