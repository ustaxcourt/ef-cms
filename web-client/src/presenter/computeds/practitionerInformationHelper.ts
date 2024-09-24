/* eslint-disable complexity */

import { ClientApplicationContext } from '@web-client/applicationContext';
import { formatCase } from '@shared/business/utilities/getFormattedCaseDetail';
import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
import { getSealedDocketEntryTooltip } from '@shared/business/utilities/getSealedDocketEntryTooltip';
export const practitionerInformationHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const PAGE_SIZE = 3;

  const permissions = get(state.permissions);
  const practitionerDetail = get(state.practitionerDetail);

  const user = get(state.user);
  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  console.log('practitionerDetail', practitionerDetail);

  const totalOpenCasePages = Math.ceil(
    practitionerDetail.openCaseDetail.allCases.length / PAGE_SIZE,
  );

  const totalClosedCasesPages = Math.ceil(
    practitionerDetail.closedCaseDetails.allCases.length / PAGE_SIZE,
  );

  const showOpenCasesPagination = totalOpenCasePages > 1;
  const showClosedCasesPagination = totalClosedCasesPages > 1;

  const openCasesToDisplay = practitionerDetail.openCaseDetail.allCases
    .slice(
      practitionerDetail.openCaseDetail.currentPage * PAGE_SIZE,
      (practitionerDetail.openCaseDetail.currentPage + 1) * PAGE_SIZE,
    )
    .map(c => {
      c = formatCase(applicationContext, c, user);
      c.sealedToTooltip = getSealedDocketEntryTooltip(applicationContext, c);
      return c;
    });

  const closedCasesToDisplay = practitionerDetail.closedCaseDetails.allCases
    .slice(
      practitionerDetail.closedCaseDetails.currentPage * PAGE_SIZE,
      (practitionerDetail.closedCaseDetails.currentPage + 1) * PAGE_SIZE,
    )
    .map(c => {
      c = formatCase(applicationContext, c, user);
      c.sealedToTooltip = getSealedDocketEntryTooltip(applicationContext, c);
      return c;
    });

  return {
    closedCases: closedCasesToDisplay,
    closedCasesPageNumber: practitionerDetail.closedCaseDetails.currentPage,
    closedCasesTotal: practitionerDetail.closedCaseDetails.allCases.length,
    openCases: openCasesToDisplay,
    openCasesPageNumber: practitionerDetail.openCaseDetail.currentPage,
    openCasesTotal: practitionerDetail.openCaseDetail.allCases.length,
    showClosedCasesPagination,
    showDocumentationTab: permissions.UPLOAD_PRACTITIONER_DOCUMENT,
    showOpenCasesPagination,
    showPrintCaseListLink: isInternalUser,
    totalClosedCasesPages,
    totalOpenCasePages,
    userId: practitionerDetail.userId,
  };
};
