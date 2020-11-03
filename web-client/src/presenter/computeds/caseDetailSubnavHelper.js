import { state } from 'cerebral';

export const caseDetailSubnavHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
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

  return {
    selectedCaseInformationTab,
    showCaseInformationTab:
      isInternalUser || (!isInternalUser && userAssociatedWithCase),
    showCorrespondenceTab: isInternalUser,
    showDraftsTab: isInternalUser,
    showMessagesTab: isInternalUser,
    showNotesTab: isInternalUser,
    showTrackedItemsTab: isInternalUser,
  };
};
