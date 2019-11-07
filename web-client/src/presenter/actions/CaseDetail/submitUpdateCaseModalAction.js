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
  const { caseCaption, caseStatus } = get(state.modal);
  const caseToUpdate = get(state.caseDetail);

  let updatedCase = caseToUpdate;
  if (caseCaption && caseToUpdate.caseCaption !== caseCaption) {
    updatedCase = await applicationContext
      .getUseCases()
      .updateCaseCaptionInteractor({
        applicationContext,
        caseCaption,
        caseId: caseToUpdate.caseId,
      });
  }

  if (caseStatus && caseToUpdate.status !== caseStatus) {
    updatedCase = await applicationContext
      .getUseCases()
      .updateCaseStatusInteractor({
        applicationContext,
        caseId: caseToUpdate.caseId,
        caseStatus,
      });
  }

  return { caseDetail: updatedCase };
};
