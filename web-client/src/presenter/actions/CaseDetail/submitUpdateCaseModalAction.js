import { state } from 'cerebral';

/**
 * Updates the case caption and case status
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the get function
 * @param {object} providers.store the cerebral store object
 */

export const submitUpdateCaseModalAction = async ({
  applicationContext,
  get,
}) => {
  const { caseCaption, caseStatus } = get(state.modal);
  const caseToUpdate = get(state.caseDetail);

  if (caseToUpdate) {
    if (caseCaption && caseToUpdate.caseCaption !== caseCaption) {
      await applicationContext.getUseCases().updateCaseCaptionInteractor({
        applicationContext,
        caseCaption,
        caseId: caseToUpdate.caseId,
      });
    }

    if (caseStatus && caseToUpdate.status !== caseStatus) {
      await applicationContext.getUseCases().updateCaseStatusInteractor({
        applicationContext,
        caseCaption,
        caseId: caseToUpdate.caseId,
      });
    }
  }
};
