import { isEmpty } from 'lodash';
import { state } from 'cerebral';

export const caseDetailHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const caseDeadlines = get(state.caseDeadlines) || [];
  const documentDetailTab =
    get(state.currentViewMetadata.caseDetail.primaryTab) || 'docketRecord';
  const currentPage = get(state.currentPage);
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const permissions = get(state.permissions);
  const showJudgesNotes = permissions.JUDGES_NOTES;

  let showFileDocumentButton =
    permissions.FILE_EXTERNAL_DOCUMENT && ['CaseDetail'].includes(currentPage);

  let showCaseDeadlinesExternal = false;
  let showCaseDeadlinesInternal = false;
  let showCaseDeadlinesInternalEmpty = false;
  let userHasAccessToCase = false;
  let showQcWorkItemsUntouchedState = false;

  if (isExternalUser) {
    if (userAssociatedWithCase) {
      userHasAccessToCase = true;
      showFileDocumentButton = true;

      if (caseDeadlines.length > 0) {
        showCaseDeadlinesExternal = true;
      }
    } else {
      showFileDocumentButton = false;
    }
  } else {
    userHasAccessToCase = true;
    showQcWorkItemsUntouchedState = true;

    if (caseDeadlines.length > 0) {
      showCaseDeadlinesInternal = true;
    } else {
      showCaseDeadlinesInternalEmpty = true;
    }
  }

  const hasConsolidatedCases = !isEmpty(caseDetail.consolidatedCases);

  const caseHasServedDocketEntries = applicationContext
    .getUtilities()
    .caseHasServedDocketEntries(caseDetail);

  const hasPrivatePractitioners =
    !!caseDetail.privatePractitioners &&
    !!caseDetail.privatePractitioners.length;
  const hasIrsPractitioners =
    !!caseDetail.irsPractitioners && !!caseDetail.irsPractitioners.length;

  return {
    caseDeadlines,
    documentDetailTab,
    hasConsolidatedCases,
    hasIrsPractitioners,
    hasPrivatePractitioners,
    showAddCorrespondenceButton: permissions.CASE_CORRESPONDENCE,
    showAddRemoveFromHearingButtons: permissions.SET_FOR_HEARING,
    showCaseDeadlinesExternal,
    showCaseDeadlinesInternal,
    showCaseDeadlinesInternalEmpty,
    showCaseInformationExternal: isExternalUser,
    showDocketRecordInProgressState: !isExternalUser,
    showEditCaseDetailsButton: permissions.EDIT_CASE_DETAILS,
    showFileDocumentButton,
    showFilingFeeExternal:
      isExternalUser &&
      user.role !== USER_ROLES.irsPractitioner &&
      user.role !== USER_ROLES.irsSuperuser,
    showJudgesNotes,
    showPetitionProcessingAlert: isExternalUser && !caseHasServedDocketEntries,
    showPractitionerSection: !isExternalUser || hasPrivatePractitioners,
    showPreferredTrialCity: caseDetail.preferredTrialCity,
    showQcWorkItemsUntouchedState,
    userCanViewCase:
      (isExternalUser && userAssociatedWithCase) || !caseDetail.isSealed,
    userHasAccessToCase,
  };
};
