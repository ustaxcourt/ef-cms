/* eslint-disable complexity */

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from '../../utilities/cerebralWrapper';
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
  const userIsAssociatedWithCase = get(state.screenMetadata.isAssociated);

  let showFileDocumentButton =
    permissions.FILE_EXTERNAL_DOCUMENT && ['CaseDetail'].includes(currentPage);

  let showCaseDeadlinesExternal = false;
  let showCaseDeadlinesInternal = false;
  let showCaseDeadlinesInternalEmpty = false;
  let userHasAccessToCase = false;
  let showQcWorkItemsUntouchedState = false;

  if (isExternalUser) {
    if (userIsAssociatedWithCase) {
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

  const showConsolidatedCasesCard =
    permissions.VIEW_CONSOLIDATED_CASES_CARD && !!caseDetail.leadDocketNumber;

  const showFilingFeeExternal =
    isExternalUser &&
    user.role !== USER_ROLES.irsPractitioner &&
    user.role !== USER_ROLES.irsSuperuser;

  const showJudgesNotes = permissions.JUDGES_NOTES;

  const showPetitionProcessingAlert =
    isExternalUser &&
    !canAllowDocumentServiceForCase &&
    userIsAssociatedWithCase;

  const showPractitionerSection = !isExternalUser || hasPrivatePractitioners;

  const isPractitioner =
    user.role === USER_ROLES.irsPractitioner ||
    user.role === USER_ROLES.privatePractitioner;
  const isPetitioner = user.role === USER_ROLES.petitioner;
  const showSealedCaseView =
    (isPractitioner || isPetitioner) &&
    !!isSealedCase &&
    !userIsAssociatedWithCase;

  const userCanViewCase =
    (isExternalUser && userIsAssociatedWithCase) || !isSealedCase;

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
    showFilingFeeExternal,
    showJudgesNotes,
    showPetitionProcessingAlert,
    showPractitionerSection,
    showPreferredTrialCity: caseDetail.preferredTrialCity,
    showQcWorkItemsUntouchedState,
    showSealedCaseView,
    userCanViewCase,
    userHasAccessToCase,
  };
};
