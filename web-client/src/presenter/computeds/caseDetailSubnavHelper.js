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

  const hasPendingItems = get(state.caseDetail.hasPendingItems);
  const caseDeadlines = get(state.caseDeadlines);
  const isIrsPractitioner = user.role === USER_ROLES.irsPractitioner;
  const showNotesIcon =
    get(state.caseDetail.caseNote) || get(state.judgesNote.notes);

  return {
    selectedCaseInformationTab,
    showCaseInformationTab:
      isInternalUser ||
      (!isInternalUser && userAssociatedWithCase) ||
      isIrsPractitioner,
    showCorrespondenceTab: isInternalUser,
    showDraftsTab: isInternalUser,
    showMessagesTab: isInternalUser,
    showNotesIcon,
    showNotesTab: isInternalUser,
    showTrackedItemsNotification: hasPendingItems || !!caseDeadlines?.length,
    showTrackedItemsTab: isInternalUser,
  };
};
