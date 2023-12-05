/* eslint-disable complexity */

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const caseDetailHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  const permissions = get(state.permissions);
  const hasTrackedItemsPermission = permissions.TRACKED_ITEMS;
  const caseDetail = get(state.caseDetail);
  const caseDeadlines = get(state.caseDeadlines) || [];
  const documentDetailTab =
    get(state.currentViewMetadata.caseDetail.primaryTab) || 'docketRecord';
  const currentPage = get(state.currentPage);
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
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

  const canAllowDocumentServiceForCase = applicationContext
    .getUtilities()
    .canAllowDocumentServiceForCase(caseDetail);

  const hasPrivatePractitioners =
    !!caseDetail.privatePractitioners &&
    !!caseDetail.privatePractitioners.length;
  const hasIrsPractitioners =
    !!caseDetail.irsPractitioners && !!caseDetail.irsPractitioners.length;

  const isSealedCase = applicationContext
    .getUtilities()
    .isSealedCase(caseDetail);

  const userCanViewCase =
    (isExternalUser && userAssociatedWithCase) || !isSealedCase;

  const isPractitioner =
    user.role === USER_ROLES.irsPractitioner ||
    user.role === USER_ROLES.privatePractitioner;

  const isPetitioner = user.role === USER_ROLES.petitioner;

  const showSealedCaseView =
    (isPractitioner || isPetitioner) &&
    !!isSealedCase &&
    !userAssociatedWithCase;

  const showConsolidatedCasesCard =
    permissions.VIEW_CONSOLIDATED_CASES_CARD && !!caseDetail.leadDocketNumber;

  return {
    caseDeadlines,
    documentDetailTab,
    hasConsolidatedCases,
    hasIrsPractitioners,
    hasPrivatePractitioners,
    hasTrackedItemsPermission,
    showAddCorrespondenceButton: permissions.CASE_CORRESPONDENCE,
    showAddRemoveFromHearingButtons: permissions.SET_FOR_HEARING,
    showCaseDeadlinesExternal,
    showCaseDeadlinesInternal,
    showCaseDeadlinesInternalEmpty,
    showCaseInformationExternal: isExternalUser,
    showConsolidatedCasesCard,
    showDocketRecordInProgressState: !isExternalUser,
    showEditCaseDetailsButton: permissions.EDIT_CASE_DETAILS,
    showFileDocumentButton,
    showFilingFeeExternal:
      isExternalUser &&
      user.role !== USER_ROLES.irsPractitioner &&
      user.role !== USER_ROLES.irsSuperuser,
    showJudgesNotes,
    showPetitionProcessingAlert:
      isExternalUser && !canAllowDocumentServiceForCase,
    showPractitionerSection: !isExternalUser || hasPrivatePractitioners,
    showPreferredTrialCity: caseDetail.preferredTrialCity,
    showQcWorkItemsUntouchedState,
    showSealedCaseView,
    userCanViewCase,
    userHasAccessToCase,
  };
};
