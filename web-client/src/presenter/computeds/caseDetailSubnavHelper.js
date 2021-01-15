import { state } from 'cerebral';

export const caseDetailSubnavHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);

  const primaryTab = get(state.currentViewMetadata.caseDetail.primaryTab);
  const caseInformationTab = get(
    state.currentViewMetadata.caseDetail.caseInformationTab,
  );

  const selectedCaseInformationTab =
    primaryTab === 'caseInformation' ? caseInformationTab : primaryTab;

  const isIrsPractitioner = user.role === USER_ROLES.irsPractitioner;

  return {
    selectedCaseInformationTab,
    showCaseInformationTab:
      isInternalUser ||
      (!isInternalUser && userAssociatedWithCase) ||
      isIrsPractitioner,
    showCorrespondenceTab: isInternalUser,
    showDraftsTab: isInternalUser,
    showMessagesTab: isInternalUser,
    showNotesTab: isInternalUser,
    showTrackedItemsTab: isInternalUser,
  };
};
