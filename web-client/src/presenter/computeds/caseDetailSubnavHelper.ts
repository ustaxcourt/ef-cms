import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const caseDetailSubnavHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
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

  const draftDocketEntryCount = getDraftItems(get);

  return {
    draftDocketEntryCount,
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

const getDraftItems = get => {
  const caseDetails = get(state.caseDetail);

  const caseDetailsWithDraftDocketEntries = caseDetails.docketEntries.filter(
    docketEntry => docketEntry.isDraft,
  );
  return caseDetailsWithDraftDocketEntries.length;
};
