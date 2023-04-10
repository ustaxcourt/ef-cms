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

  const { caseCaption, caseStatus, judgeUserId } = get(state.modal);

  let selectedJudgeUserId = judgeUserId;
  if (!STATUS_TYPES_WITH_ASSOCIATED_JUDGE.includes(caseStatus)) {
    selectedJudgeUserId = undefined;
  }

  let updatedCase = caseToUpdate;

  if (
    (caseStatus && caseToUpdate.status !== caseStatus) ||
    (selectedJudgeUserId && caseToUpdate.judgeUserId !== selectedJudgeUserId) ||
    (caseCaption && caseToUpdate.caseCaption !== caseCaption)
  ) {
    updatedCase = await applicationContext
      .getUseCases()
      .updateCaseContextInteractor(applicationContext, {
        caseCaption,
        caseStatus,
        docketNumber: caseToUpdate.docketNumber,
        judgeUserId: selectedJudgeUserId,
      });
  }

  return {
    alertSuccess: {
      message: 'Changes saved.',
    },
    caseDetail: updatedCase,
  };
};
