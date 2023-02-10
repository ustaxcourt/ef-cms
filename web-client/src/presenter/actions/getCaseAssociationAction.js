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
    const caseDetail = get(state.caseDetail);
    if (caseDetail.leadDocketNumber) {
      if (isConsolidatedGroupAccessEnabled) {
        isAssociated = applicationContext.getUtilities().isUserPartOfGroup({
          consolidatedCases: caseDetail.consolidatedCases,
          userId: user.userId,
        });
      } else {
        isAssociated = caseDetail.privatePractitioners.some(
          practitioner => practitioner.userId === user.userId,
        );
      }
      isDirectlyAssociated = caseDetail.privatePractitioners.some(
        practitioner => practitioner.userId === user.userId,
      );
    } else {
      isAssociated = caseDetail.privatePractitioners.some(
        practitioner => practitioner.userId === user.userId,
      );
      isDirectlyAssociated = isAssociated;
    }

    if (!isAssociated) {
      pendingAssociation = await applicationContext
        .getUseCases()
        .verifyPendingCaseForUserInteractor(applicationContext, {
          docketNumber: caseDetail.docketNumber,
          userId: user.userId,
        });
    }
  } else if (user.role === USER_ROLES.irsPractitioner) {
    const caseDetail = get(state.caseDetail);
    if (caseDetail.leadDocketNumber) {
      if (isConsolidatedGroupAccessEnabled) {
        isAssociated = applicationContext.getUtilities().isUserPartOfGroup({
          consolidatedCases: caseDetail.consolidatedCases,
          userId: user.userId,
        });
      } else {
        isAssociated = caseDetail.irsPractitioners.some(
          practitioner => practitioner.userId === user.userId,
        );
      }
      isDirectlyAssociated = caseDetail.irsPractitioners.some(
        practitioner => practitioner.userId === user.userId,
      );
    } else {
      isAssociated = caseDetail.irsPractitioners.some(
        practitioner => practitioner.userId === user.userId,
      );
      isDirectlyAssociated = isAssociated;
    }
  } else if (user.role === USER_ROLES.petitioner) {
    const caseDetail = get(state.caseDetail);
    if (caseDetail.leadDocketNumber) {
      if (isConsolidatedGroupAccessEnabled) {
        isAssociated = applicationContext.getUtilities().isUserPartOfGroup({
          consolidatedCases: caseDetail.consolidatedCases,
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
