import { state } from '@web-client/presenter/app.cerebral';

/**
 * Determines if the user is associated with the case or not, and if there is a
 * pending association to the case for privatePractitioners
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @returns {object} contains the association returned from the use case
 */
export const getCaseAssociationAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const user = applicationContext.getCurrentUser();

  const { USER_ROLES } = applicationContext.getConstants();

  const caseDetail = get(state.caseDetail);

  let isAssociated = false;
  let isDirectlyAssociated = false;
  let pendingAssociation = false;

  if (
    user.role === USER_ROLES.irsSuperuser ||
    applicationContext.getUtilities().isInternalUser(user.role)
  ) {
    isAssociated = true;

    if (user.role === USER_ROLES.irsSuperuser) {
      const canAllowDocumentServiceForCase = applicationContext
        .getUtilities()
        .canAllowDocumentServiceForCase(caseDetail);

      isAssociated = canAllowDocumentServiceForCase;
    }

    return {
      isAssociated,
      isDirectlyAssociated,
      pendingAssociation,
    };
  }

  const caseParties = [
    ...(caseDetail.privatePractitioners || []),
    ...(caseDetail.irsPractitioners || []),
    ...(caseDetail.petitioners || []),
  ];
  const idName = user.role === USER_ROLES.petitioner ? 'contactId' : 'userId';

  if (caseDetail.leadDocketNumber) {
    isAssociated = applicationContext.getUtilities().isUserPartOfGroup({
      consolidatedCases: caseDetail.consolidatedCases,
      userId: user[`${idName}`],
    });
  } else {
    isAssociated = caseParties.some(party => party[idName] === user.userId);
  }

  isDirectlyAssociated = caseParties.some(
    party => party[idName] === user.userId,
  );

  if (!isAssociated && user.role === USER_ROLES.privatePractitioner) {
    pendingAssociation = await applicationContext
      .getUseCases()
      .verifyPendingCaseForUserInteractor(applicationContext, {
        docketNumber: caseDetail.docketNumber,
      });
  }

  return {
    isAssociated,
    isDirectlyAssociated,
    pendingAssociation,
  };
};
