import { state } from 'cerebral';

export const caseDetailSubnavHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);

  return {
    showCaseInformationTab:
      isInternalUser || (!isInternalUser && userAssociatedWithCase),
    showDeadlinesTab: isInternalUser,
    showInProgressTab: isInternalUser,
    showNotesTab: isInternalUser,
  };
};
