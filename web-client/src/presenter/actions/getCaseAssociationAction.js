import { some } from 'lodash';
import { state } from 'cerebral';

/**
 * Determines if the user is associated with the case or not, and if there is a
 * pending association to the case for practitioners
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @returns {object} contains the association returned from the use case
 */
export const getCaseAssociationAction = async ({ applicationContext, get }) => {
  const userRole = get(state.user.role);
  const { USER_ROLES } = applicationContext.getConstants();
  let isAssociated = false;
  let pendingAssociation = false;

  if (userRole === USER_ROLES.practitioner) {
    const caseDetailPractitioners = get(state.caseDetail.practitioners);
    const userId = get(state.user.userId);
    const caseId = get(state.caseDetail.caseId);

    isAssociated = some(caseDetailPractitioners, { userId });

    if (!isAssociated) {
      pendingAssociation = await applicationContext
        .getUseCases()
        .verifyPendingCaseForUserInteractor({
          applicationContext,
          caseId,
          userId,
        });
    }
  } else if (userRole === USER_ROLES.respondent) {
    const caseDetailRespondents = get(state.caseDetail.respondents);
    const userId = get(state.user.userId);
    isAssociated = some(caseDetailRespondents, { userId });
  } else if (userRole === USER_ROLES.petitioner) {
    const caseUserId = get(state.caseDetail.userId);
    const userId = get(state.user.userId);
    isAssociated = caseUserId === userId;
  }

  return { isAssociated, pendingAssociation };
};
