/* eslint-disable complexity */

import { ClientApplicationContext } from '@web-client/applicationContext';
import { formatCase } from '@shared/business/utilities/getFormattedCaseDetail';
import { state } from '@web-client/presenter/app.cerebral';

import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Get } from 'cerebral';
import { getSealedDocketEntryTooltip } from '@shared/business/utilities/getSealedDocketEntryTooltip';

const PAGE_SIZE = 100;

const getPagesToDisplay = ({
  applicationContext,
  cases,
  pageNumber,
  user,
}: {
  pageNumber: number;
  cases: any[];
  applicationContext: ClientApplicationContext;
  user: AuthUser;
}) => {
  return cases
    .slice(pageNumber * PAGE_SIZE, (pageNumber + 1) * PAGE_SIZE)
    .map(c => {
      c = formatCase(applicationContext, c, user);
      c.sealedToTooltip = getSealedDocketEntryTooltip(applicationContext, c);
      return c;
    });
};

export const practitionerInformationHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  closedCases: any;
  closedCasesPageNumber: number;
  closedCasesTotal: number;
  openCases: any;
  openCasesPageNumber: number;
  openCasesTotal: number;
  showClosedCasesPagination: boolean;
  showDocumentationTab: boolean;
  showOpenCasesPagination: boolean;
  showPrintCaseListLink: boolean;
  totalClosedCasesPages: number;
  totalOpenCasesPages: number;
  userId: string;
} => {
  const permissions = get(state.permissions);
  const practitionerDetail = get(state.practitionerDetail);

  const user = get(state.user);
  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const totalOpenCasesPages = Math.ceil(
    (practitionerDetail.openCaseInfo?.allCases.length || 0) / PAGE_SIZE,
  );

  const totalClosedCasesPages = Math.ceil(
    (practitionerDetail.closedCaseInfo?.allCases.length || 0) / PAGE_SIZE,
  );

  const showOpenCasesPagination = totalOpenCasesPages > 1;
  const showClosedCasesPagination = totalClosedCasesPages > 1;

  const openCasesToDisplay = getPagesToDisplay({
    applicationContext,
    cases: practitionerDetail.openCaseInfo?.allCases || [],
    pageNumber: practitionerDetail.openCaseInfo?.currentPage || 0,
    user,
  });

  const closedCasesToDisplay = getPagesToDisplay({
    applicationContext,
    cases: practitionerDetail.closedCaseInfo?.allCases || [],
    pageNumber: practitionerDetail.closedCaseInfo?.currentPage || 0,
    user,
  });

  return {
    closedCases: closedCasesToDisplay,
    closedCasesPageNumber: practitionerDetail.closedCaseInfo?.currentPage || 0,
    closedCasesTotal: practitionerDetail.closedCaseInfo?.allCases.length || 0,
    openCases: openCasesToDisplay,
    openCasesPageNumber: practitionerDetail.openCaseInfo?.currentPage || 0,
    openCasesTotal: practitionerDetail.openCaseInfo?.allCases.length || 0,
    showClosedCasesPagination,
    showDocumentationTab: permissions.UPLOAD_PRACTITIONER_DOCUMENT,
    showOpenCasesPagination,
    showPrintCaseListLink: isInternalUser,
    totalClosedCasesPages,
    totalOpenCasesPages,
    userId: practitionerDetail.userId,
  };
};
