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

  if (
    practitionerDetail.openCasesPageNumber === null ||
    practitionerDetail.openCasesPageNumber === undefined
  ) {
    practitionerDetail.openCasesPageNumber = 0;
  }

  if (
    practitionerDetail.closedCases.pageNumber === null ||
    practitionerDetail.closedCases.pageNumber === undefined
  ) {
    practitionerDetail.closedCases.pageNumber = 0;
  }

  const user = get(state.user);
  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  console.log('practitionerDetail', practitionerDetail);

  const totalOpenCasePages = Math.ceil(
    practitionerDetail.openCases.length / PAGE_SIZE,
  );

  const totalClosedCasesPages = Math.ceil(
    practitionerDetail.closedCases.length / PAGE_SIZE,
  );

  const showOpenCasesPagination = totalOpenCasePages > 1;
  const showClosedCasesPagination = totalClosedCasesPages > 1;

  const openCases = practitionerDetail.openCases
    .slice(
      practitionerDetail.openCasesPageNumber * PAGE_SIZE,
      (practitionerDetail.openCasesPageNumber + 1) * PAGE_SIZE,
    )
    .map(c => {
      c = formatCase(applicationContext, c, user);
      c.sealedToTooltip = getSealedDocketEntryTooltip(applicationContext, c);
      return c;
    });

  const closedCases = practitionerDetail.closedCases
    .slice(
      practitionerDetail.closedCases.pageNumber * PAGE_SIZE,
      (practitionerDetail.closedCases.pageNumber + 1) * PAGE_SIZE,
    )
    .map(c => {
      c = formatCase(applicationContext, c, user);
      c.sealedToTooltip = getSealedDocketEntryTooltip(applicationContext, c);
      return c;
    });

  return {
    closedCases,
    closedCasesTotal: practitionerDetail.closedCases.length,
    openCases,
    openCasesPageNumber: practitionerDetail.openCasesPageNumber,
    openCasesTotal: practitionerDetail.openCases.length,
    pageNumber: 0,
    showClosedCasesPagination,
    showDocumentationTab: permissions.UPLOAD_PRACTITIONER_DOCUMENT,
    showOpenCasesPagination,
    showPrintCaseListLink: isInternalUser,
    totalClosedCasesPages,
    totalOpenCasePages,
    userId: practitionerDetail.userId,
  };
};
