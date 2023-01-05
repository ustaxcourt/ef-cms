import { some } from 'lodash';
import { state } from 'cerebral';

/**
 * Determines if the user is associated with the case or not, and if there is a
 * pending association to the case for privatePractitioners
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @returns {object} contains the association returned from the use case
 */
export const getCaseAssociationAction = async ({ applicationContext, get }) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  let isAssociated = false;
  let isDirectlyAssociated = false;
  let pendingAssociation = false;

  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();
  const isConsolidatedGroupAccessEnabled = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER.key
    ],
  );

  if (user.role === USER_ROLES.privatePractitioner) {
    const caseDetailPractitioners = get(state.caseDetail.privatePractitioners);
    const docketNumber = get(state.caseDetail.docketNumber);

    isAssociated = some(caseDetailPractitioners, { userId: user.userId });
    isDirectlyAssociated = isAssociated;
    if (!isAssociated) {
      pendingAssociation = await applicationContext
        .getUseCases()
        .verifyPendingCaseForUserInteractor(applicationContext, {
          docketNumber,
          userId: user.userId,
        });
    }
  } else if (user.role === USER_ROLES.irsPractitioner) {
    const caseDetailRespondents = get(state.caseDetail.irsPractitioners);

    isAssociated = some(caseDetailRespondents, { userId: user.userId });
    isDirectlyAssociated = isAssociated;
  } else if (user.role === USER_ROLES.petitioner) {
    const caseDetail = get(state.caseDetail);

    if (caseDetail.leadDocketNumber) {
      if (isConsolidatedGroupAccessEnabled) {
        isAssociated = applicationContext
          .getUtilities()
          .isPetitionerPartOfGroup({
            consolidatedCases: caseDetail.consolidatedCases,
            isPartyOfCase: applicationContext.getUtilities().getPetitionerById,
            userId: user.userId,
          });
      } else {
        isAssociated = !!applicationContext
          .getUtilities()
          .getPetitionerById(caseDetail, user.userId);
      }
      isDirectlyAssociated = !!applicationContext
        .getUtilities()
        .getPetitionerById(caseDetail, user.userId);
    } else {
      isAssociated = !!applicationContext
        .getUtilities()
        .getPetitionerById(caseDetail, user.userId);
      isDirectlyAssociated = isAssociated;
    }
  } else if (user.role === USER_ROLES.irsSuperuser) {
    const caseDetail = get(state.caseDetail);
    const canAllowDocumentServiceForCase = applicationContext
      .getUtilities()
      .canAllowDocumentServiceForCase(caseDetail);

    isAssociated = canAllowDocumentServiceForCase;
  } else if (applicationContext.getUtilities().isInternalUser(user.role)) {
    isAssociated = true;
  }

  return {
    isAssociated,
    isDirectlyAssociated: isConsolidatedGroupAccessEnabled
      ? isDirectlyAssociated
      : isAssociated,
    pendingAssociation,
  };
};
