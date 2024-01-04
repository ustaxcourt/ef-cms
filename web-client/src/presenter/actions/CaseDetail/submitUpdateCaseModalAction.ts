import { state } from '@web-client/presenter/app.cerebral';

/**
 * Updates the case caption and case status
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the get function
 * @returns {object} the updated case as caseDetail
 */
export const submitUpdateCaseModalAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { associatedJudge, associatedJudgeId, caseCaption, caseStatus } = get(
    state.modal,
  );
  let selectedAssociatedJudge = associatedJudge;
  let selectedAssociatedJudgeId = associatedJudgeId;
  const caseToUpdate = get(state.caseDetail);
  const { STATUS_TYPES_WITH_ASSOCIATED_JUDGE } =
    applicationContext.getConstants();

  if (!STATUS_TYPES_WITH_ASSOCIATED_JUDGE.includes(caseStatus)) {
    selectedAssociatedJudge = undefined;
    selectedAssociatedJudgeId = undefined;
  }

  let updatedCase = caseToUpdate;

  if (
    (caseStatus && caseToUpdate.status !== caseStatus) ||
    (selectedAssociatedJudge &&
      caseToUpdate.associatedJudge !== selectedAssociatedJudge) ||
    (selectedAssociatedJudgeId &&
      caseToUpdate.associatedJudgeId !== selectedAssociatedJudgeId) ||
    (caseCaption && caseToUpdate.caseCaption !== caseCaption)
  ) {
    const judgeData: {
      associatedJudge: string;
      associatedJudgeId: string;
    } = {
      associatedJudge: selectedAssociatedJudge,
      associatedJudgeId: selectedAssociatedJudgeId,
    };
    updatedCase = await applicationContext
      .getUseCases()
      .updateCaseContextInteractor(applicationContext, {
        caseCaption,
        caseStatus,
        docketNumber: caseToUpdate.docketNumber,
        judgeData,
      });
  }

  return {
    alertSuccess: {
      message: 'Changes saved.',
    },
    caseDetail: updatedCase,
  };
};
