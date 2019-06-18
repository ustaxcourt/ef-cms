import { some } from 'lodash';
import { state } from 'cerebral';

/**
 * Determines if there is a pending association of the practitioner to the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {object} providers.props the cerebral props object containing props.docketNumber
 * @returns {object} contains the association returned from the use case
 */
export const getCaseAssociationAction = async ({ applicationContext, get }) => {
  const caseDetailPractitioners = get(state.caseDetail.practitioners);
  const userId = get(state.user.userId);
  const caseId = get(state.caseDetail.caseId);

  const isAssociated = some(caseDetailPractitioners, { userId });
  if (isAssociated) {
    return { isAssociated: true };
  }

  const hasPendingAssociation = await applicationContext
    .getUseCases()
    .verifyPendingCaseForUser({
      applicationContext,
      caseId,
      userId,
    });

  if (hasPendingAssociation) {
    return { pendingAssociation: true };
  }

  return { notAssociated: true };
};
