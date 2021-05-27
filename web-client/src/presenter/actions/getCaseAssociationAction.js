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
  let pendingAssociation = false;

  if (user.role === USER_ROLES.privatePractitioner) {
    const caseDetailPractitioners = get(state.caseDetail.privatePractitioners);
    const docketNumber = get(state.caseDetail.docketNumber);

    isAssociated = some(caseDetailPractitioners, { userId: user.userId });
    if (!isAssociated) {
      pendingAssociation = await applicationContext
        .getUseCases()
        .verifyPendingCaseForUserInteractor({
          applicationContext,
          docketNumber,
          userId: user.userId,
        });
    }
  } else if (user.role === USER_ROLES.irsPractitioner) {
    const caseDetailRespondents = get(state.caseDetail.irsPractitioners);

    isAssociated = some(caseDetailRespondents, { userId: user.userId });
  } else if (user.role === USER_ROLES.petitioner) {
    const caseDetail = get(state.caseDetail);

    const contactPrimary = applicationContext
      .getUtilities()
      .getContactPrimary(caseDetail);

    const caseContactPrimaryId = contactPrimary && contactPrimary.contactId;

    const contactSecondary = applicationContext
      .getUtilities()
      .getContactSecondary(caseDetail);

    const caseContactSecondaryId = contactSecondary?.contactId;

    isAssociated =
      (caseContactPrimaryId && caseContactPrimaryId === user.userId) ||
      (!!caseContactSecondaryId && caseContactSecondaryId === user.userId);
  } else if (user.role === USER_ROLES.irsSuperuser) {
    const caseDetail = get(state.caseDetail);
    const caseHasServedDocketEntries = applicationContext
      .getUtilities()
      .caseHasServedDocketEntries(caseDetail);

    isAssociated = caseHasServedDocketEntries;
  }

  return { isAssociated, pendingAssociation };
};
