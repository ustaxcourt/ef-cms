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
  let caseParties = [];
  let idName = 'userId';
  const caseDetail = get(state.caseDetail);

  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();
  const isConsolidatedGroupAccessEnabled = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER.key
    ],
  );

  if (user.role === USER_ROLES.irsSuperuser) {
    const canAllowDocumentServiceForCase = applicationContext
      .getUtilities()
      .canAllowDocumentServiceForCase(caseDetail);

    isAssociated = canAllowDocumentServiceForCase;
    return {
      isAssociated,
      isDirectlyAssociated: isConsolidatedGroupAccessEnabled
        ? isDirectlyAssociated
        : isAssociated,
      pendingAssociation,
    };
  } else if (applicationContext.getUtilities().isInternalUser(user.role)) {
    isAssociated = true;
    return {
      isAssociated,
      isDirectlyAssociated: isConsolidatedGroupAccessEnabled
        ? isDirectlyAssociated
        : isAssociated,
      pendingAssociation,
    };
  } else if (user.role === USER_ROLES.privatePractitioner) {
    caseParties = caseDetail.privatePractitioners || [];
  } else if (user.role === USER_ROLES.irsPractitioner) {
    caseParties = caseDetail.irsPractitioners || [];
  } else if (user.role === USER_ROLES.petitioner) {
    idName = 'contactId';
    caseParties = caseDetail.petitioners || [];
  }

  if (caseDetail.leadDocketNumber) {
    if (isConsolidatedGroupAccessEnabled) {
      isAssociated = applicationContext.getUtilities().isUserPartOfGroup({
        consolidatedCases: caseDetail.consolidatedCases,
        userId: user.userId,
      });
    } else {
      isAssociated = caseParties.some(
        party => party[`${idName}`] === user.userId,
      );
    }
    isDirectlyAssociated = caseParties.some(
      party => party[`${idName}`] === user.userId,
    );
  } else {
    isAssociated = caseParties.some(
      party => party[`${idName}`] === user.userId,
    );
    isDirectlyAssociated = isAssociated;
  }

  if (!isAssociated && user.role === USER_ROLES.privatePractitioner) {
    pendingAssociation = await applicationContext
      .getUseCases()
      .verifyPendingCaseForUserInteractor(applicationContext, {
        docketNumber: caseDetail.docketNumber,
        userId: user.userId,
      });
  }

  return {
    isAssociated,
    isDirectlyAssociated: isConsolidatedGroupAccessEnabled
      ? isDirectlyAssociated
      : isAssociated,
    pendingAssociation,
  };
};
