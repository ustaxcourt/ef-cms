import { Button } from '../ustc-ui/Button/Button';
import { CaseListRowExternal } from './CaseListRowExternal';
import { NonPhone, Phone } from '../ustc-ui/Responsive/Responsive';
import { TAssociatedCaseFormatted } from '@web-client/presenter/computeds/Dashboard/externalUserCasesHelper';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { WarningNotification } from './WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { CaseStatusInfoModal } from '@web-client/views/RecentFilings/CaseStatusInfoModal';
import { SortableHeader } from '@web-client/ustc-ui/Table/SortableHeader';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import {
  PaginationResult,
  useClientSidePaginator,
} from '@web-client/utilities/useClientSidePaginator';
import { CASE_LIST_PAGE_SIZE } from '@shared/business/entities/EntityConstants';

export const CaseListTable = connect(
  {
    caseType: state.openClosedCases.caseType,
    clearOpenClosedCasesCurrentPageSequence:
      sequences.clearOpenClosedCasesCurrentPageSequence,
    closedTab: state.constants.EXTERNAL_USER_DASHBOARD_TABS.CLOSED,
    dashboardExternalHelper: state.dashboardExternalHelper,
    externalUserCasesHelper: state.externalUserCasesHelper,
    openTab: state.constants.EXTERNAL_USER_DASHBOARD_TABS.OPEN,
    setCaseTypeToDisplaySequence: sequences.setCaseTypeToDisplaySequence,
    showMoreClosedCasesSequence: sequences.showMoreClosedCasesSequence,
    showMoreOpenCasesSequence: sequences.showMoreOpenCasesSequence,
    showCaseStatusInfoSequence: sequences.showCaseStatusInfoSequence,
    showModal: state.modal.showModal,
    caseListTableSort: state.caseListTableSort,
    sortTableSequence: sequences.sortTableSequence,
  },
  function CaseListTable({
    caseType,
    clearOpenClosedCasesCurrentPageSequence,
    closedTab,
    dashboardExternalHelper,
    externalUserCasesHelper,
    openTab,
    setCaseTypeToDisplaySequence,
    showCaseStatusInfoSequence,
    showModal,
    caseListTableSort,
    sortTableSequence,
  }) {
    const paginatorTop = useRef<HTMLDivElement>(null);
    const closedPagination = useClientSidePaginator(
      externalUserCasesHelper.closedCaseResults,
      CASE_LIST_PAGE_SIZE,
    );
    const openPagination = useClientSidePaginator(
      externalUserCasesHelper.openCaseResults,
      CASE_LIST_PAGE_SIZE,
    );

    useEffect(() => {
      return () => {
        clearOpenClosedCasesCurrentPageSequence();
      };
    }, []);

    const renderStartButton = () => (
      <Button
        aria-describedby=""
        className="margin-top-1 margin-right-0"
        data-testid="file-a-petition"
        href={'/before-filing-a-petition'}
        icon="file"
        id="file-a-petition"
      >
        Create a Case
      </Button>
    );

    const renderCaseListTable = ({
      cases = [],
      isMobile,
      tabName,
      casePagination,
    }: {
      cases: TAssociatedCaseFormatted[];
      tabName: string;
      isMobile: boolean;
      casePagination: PaginationResult<TAssociatedCaseFormatted>;
    }) => {
      return (
        <>
          {!cases?.length && <p>You have no {tabName.toLowerCase()} cases.</p>}
          {cases?.length > 0 && (
            <>
              {dashboardExternalHelper.showFilingFee && (
                <div
                  className={`margin-bottom-1 ${isMobile ? '' : 'text-right'} `}
                >
                  *Filing fee status may take 2-3 business days from payment
                  received date or approval of waiver to update.
                </div>
              )}
              {casePagination.totalPages > 1 && (
                <div
                  ref={paginatorTop}
                  data-testid="casePaginationTop"
                  className="tw:mb-[1.875rem] tw:mt-[1.875rem] grid-col"
                >
                  <Paginator
                    currentPageIndex={casePagination.activePage}
                    totalPages={casePagination.totalPages}
                    onPageChange={pageChange => {
                      casePagination.setActivePage(pageChange);
                    }}
                  />
                </div>
              )}
              <table
                className={classNames({
                  'usa-table responsive-table dashboard ustc-table ': !isMobile,
                  'usa-table usa-table--stacked-header usa-table--borderless':
                    isMobile,
                })}
                data-testid="case-list-table"
                id="case-list"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="usa-sr-only">Lead Case Indicator</span>
                    </th>
                    <SortableHeader
                      sortField="docketNumber"
                      sortType="string"
                      tableSort={caseListTableSort}
                      title="Docket No."
                      onSort={sortTableSequence}
                      stateKey="caseListTableSort"
                    />
                    <SortableHeader
                      sortField="caseTitle"
                      sortType="string"
                      tableSort={caseListTableSort}
                      title="Case Title"
                      onSort={sortTableSequence}
                      stateKey="caseListTableSort"
                    />
                    <SortableHeader
                      sortField="filedDate"
                      sortType="date"
                      tableSort={caseListTableSort}
                      title="Filed Date"
                      onSort={sortTableSequence}
                      stateKey="caseListTableSort"
                    />
                    {tabName === openTab && (
                      <SortableHeader
                        sortField="status"
                        sortType="string"
                        tableSort={caseListTableSort}
                        title="Case Status"
                        onSort={sortTableSequence}
                        stateKey="caseListTableSort"
                      />
                    )}
                    {dashboardExternalHelper.showFilingFee && (
                      <SortableHeader
                        sortField="filingFee"
                        sortType="string"
                        tableSort={caseListTableSort}
                        title="Filing Fee*"
                        onSort={sortTableSequence}
                        stateKey="caseListTableSort"
                      />
                    )}
                  </tr>
                </thead>
                <tbody>
                  {cases.map(item => (
                    <CaseListRowExternal
                      formattedCase={item}
                      isNestedCase={false}
                      key={item.docketNumber}
                      showFilingFee={dashboardExternalHelper.showFilingFee}
                      showCaseStatusInfoSequence={showCaseStatusInfoSequence}
                      showCaseStatus={tabName === openTab}
                    />
                  ))}
                </tbody>
              </table>
              {casePagination.totalPages > 1 && (
                <div
                  data-testid="casePaginationBottom"
                  className={`grid-col  ${isMobile ? 'tw:mb-[1.875rem]' : ''}`}
                >
                  <Paginator
                    currentPageIndex={casePagination.activePage}
                    totalPages={casePagination.totalPages}
                    onPageChange={pageChange => {
                      casePagination.setActivePage(pageChange);
                      focusPaginatorTop(paginatorTop);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </>
      );
    };

    return (
      <>
        <WarningNotification />

        <NonPhone>
          <div className="grid-container padding-x-0">
            <div className="grid-row">
              <div className="grid-column-auto">
                <Tabs
                  bind="currentViewMetadata.caseList.tab"
                  className="classic-horizontal-header3 no-border-bottom"
                  defaultActiveTab={openTab}
                >
                  <Tab
                    data-testid="open-cases-count"
                    id="tab-open"
                    tabName={openTab}
                    title={`Open Cases (${externalUserCasesHelper.openCasesCount})`}
                  >
                    {renderCaseListTable({
                      cases: openPagination.pageRecords,
                      isMobile: false,
                      tabName: openTab,
                      casePagination: openPagination,
                    })}
                  </Tab>
                  <Tab
                    data-testid="closed-cases-count"
                    id="tab-closed"
                    tabName={closedTab}
                    title={`Closed Cases (${externalUserCasesHelper.closedCasesCount})`}
                  >
                    {renderCaseListTable({
                      cases: closedPagination.pageRecords,
                      isMobile: false,
                      tabName: closedTab,
                      casePagination: closedPagination,
                    })}
                  </Tab>
                  <div className="ustc-ui-tabs ustc-ui-tabs--right-button-container">
                    {dashboardExternalHelper.showStartButton &&
                      renderStartButton()}
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </NonPhone>

        <Phone>
          <div className="grid-container padding-x-0">
            <div className="grid-row">
              {dashboardExternalHelper.showStartButton && renderStartButton()}
            </div>
            <div className="grid-row">
              <select
                aria-label="additional case info"
                className="usa-select margin-bottom-2"
                data-testid="additional-case-select"
                onChange={e => {
                  setCaseTypeToDisplaySequence({ tabName: e.target.value });
                }}
              >
                <option value={openTab}>
                  Open Cases ({externalUserCasesHelper.openCasesCount})
                </option>
                <option value={closedTab}>
                  Closed Cases ({externalUserCasesHelper.closedCasesCount})
                </option>
              </select>
            </div>
            <div className="grid-row">
              <h3 className="grid-col-4 tw:content-center">Sort By</h3>
              <select
                id="case-list-mobile-sort"
                aria-label="Sort cases"
                className="usa-select margin-bottom-2 grid-col-8"
                data-testid="case-list-mobile-sort"
                value={`${caseListTableSort.sortField}-${caseListTableSort.sortOrder}`}
                onChange={e => {
                  const [field, key] = e.target.value.split('-');
                  sortTableSequence({
                    sortField: field,
                    sortOrder: key as 'asc' | 'desc',
                    stateKey: 'caseListTableSort',
                  });
                }}
              >
                <option value="docketNumber-asc">
                  Docket Number (Ascending)
                </option>
                <option value="docketNumber-desc">
                  Docket Number (Descending)
                </option>
                <option value="caseTitle-asc">Case Title (Ascending)</option>
                <option value="caseTitle-desc">Case Title (Descending)</option>

                <option value="filedDate-asc">Filed Date (Ascending)</option>
                <option value="filedDate-desc">Filed Date (Descending)</option>

                {caseType === openTab && (
                  <>
                    <option value="status-asc">Case Status (Ascending)</option>
                    <option value="status-desc">
                      Case Status (Descending)
                    </option>
                  </>
                )}

                {dashboardExternalHelper.showFilingFee && (
                  <>
                    <option value="filingFee-asc">
                      Filing Fee* (Ascending)
                    </option>
                    <option value="filingFee-desc">
                      Filing Fee* (Descending)
                    </option>
                  </>
                )}
              </select>
            </div>
            <div className="grid-row margin-top-1">
              {caseType === closedTab &&
                renderCaseListTable({
                  cases: closedPagination.pageRecords,
                  isMobile: true,
                  tabName: closedTab,
                  casePagination: closedPagination,
                })}
              {caseType === openTab &&
                renderCaseListTable({
                  cases: openPagination.pageRecords,
                  isMobile: true,
                  tabName: openTab,
                  casePagination: openPagination,
                })}
            </div>
          </div>
        </Phone>

        {showModal === 'CaseStatusInfoModal' && <CaseStatusInfoModal />}
      </>
    );
  },
);

CaseListTable.displayName = 'CaseListTable';
