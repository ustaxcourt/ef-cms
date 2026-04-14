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
import { useClientSidePaginator } from '@web-client/utilities/useClientSidePaginator';
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
    tableSort: state.tableSort,
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
    tableSort,
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
      casePagination: any;
    }) => {
      return (
        <>
          {!cases?.length && <p>You have no {tabName.toLowerCase()} cases.</p>}
          {cases?.length > 0 && (
            <>
              {dashboardExternalHelper.showFilingFee && (
                <div className="tw:mb-[30px] text-right">
                  *Filing fee status may take 2-3 business days from payment
                  received date or approval of waiver to update.
                </div>
              )}
              <div
                ref={paginatorTop}
                data-testid="casePaginationTop"
                className="tw:mb-[30px]"
              >
                <Paginator
                  currentPageIndex={casePagination.activePage}
                  totalPages={casePagination.totalPages}
                  onPageChange={pageChange => {
                    casePagination.setActivePage(pageChange);
                  }}
                />
              </div>
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
                      tableSort={tableSort}
                      title="Docket No."
                      onSort={sortTableSequence}
                      stateKey="tableSort"
                    />
                    <SortableHeader
                      sortField="caseTitle"
                      sortType="string"
                      tableSort={tableSort}
                      title="Case Title"
                      onSort={sortTableSequence}
                      stateKey="tableSort"
                    />
                    <SortableHeader
                      sortField="filedDate"
                      sortType="date"
                      tableSort={tableSort}
                      title="Filed Date"
                      onSort={sortTableSequence}
                      stateKey="tableSort"
                    />
                    {tabName === openTab && (
                      <SortableHeader
                        sortField="status"
                        sortType="string"
                        tableSort={tableSort}
                        title="Case Status"
                        onSort={sortTableSequence}
                        stateKey="tableSort"
                      />
                    )}
                    {dashboardExternalHelper.showFilingFee && (
                      <SortableHeader
                        sortField="filingFee"
                        sortType="string"
                        tableSort={tableSort}
                        title="Filing Fee"
                        onSort={sortTableSequence}
                        stateKey="tableSort"
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
              <div data-testid="casePaginationBottom">
                <Paginator
                  currentPageIndex={casePagination.activePage}
                  totalPages={casePagination.totalPages}
                  onPageChange={pageChange => {
                    casePagination.setActivePage(pageChange);
                    focusPaginatorTop(paginatorTop);
                  }}
                />
              </div>
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
