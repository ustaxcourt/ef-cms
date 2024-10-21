/* eslint-disable complexity */

import { ClientApplicationContext } from '@web-client/applicationContext';
import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
import { PractitionerCaseDetail } from '@web-client/presenter/state';

const PAGE_SIZE = 100;

const getPagesToDisplay = ({
  cases,
  pageNumber,
}: {
  pageNumber: number;
  cases: PractitionerCaseDetail[];
}) => {
  return cases.slice(pageNumber * PAGE_SIZE, (pageNumber + 1) * PAGE_SIZE);
};

export const practitionerInformationHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  closedCasesToDisplay: any;
  closedCasesPageNumber: number;
  closedCasesTotal: number;
  openCasesToDisplay: any;
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
    cases: practitionerDetail.openCaseInfo?.allCases || [],
    pageNumber: practitionerDetail.openCaseInfo?.currentPage || 0,
  });

  const closedCasesToDisplay = getPagesToDisplay({
    cases: practitionerDetail.closedCaseInfo?.allCases || [],
    pageNumber: practitionerDetail.closedCaseInfo?.currentPage || 0,
  });

  return {
    closedCasesPageNumber: practitionerDetail.closedCaseInfo?.currentPage || 0,
    closedCasesToDisplay,
    closedCasesTotal: practitionerDetail.closedCaseInfo?.allCases.length || 0,
    openCasesPageNumber: practitionerDetail.openCaseInfo?.currentPage || 0,
    openCasesToDisplay,
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
