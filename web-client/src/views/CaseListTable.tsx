import { Button } from '../ustc-ui/Button/Button';
import { CaseListRowExternal } from './CaseListRowExternal';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { TAssociatedCaseFormatted } from '@web-client/presenter/computeds/Dashboard/externalUserCasesHelper';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { WarningNotification } from './WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect } from 'react';

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
  },
  function CaseListTable({
    caseType,
    clearOpenClosedCasesCurrentPageSequence,
    closedTab,
    dashboardExternalHelper,
    externalUserCasesHelper,
    openTab,
    setCaseTypeToDisplaySequence,
    showMoreClosedCasesSequence,
    showMoreOpenCasesSequence,
  }) {
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
        href={
          dashboardExternalHelper.showFileACase
            ? '/file-a-petition/step-1'
            : '/before-filing-a-petition'
        }
        icon="file"
        id="file-a-petition"
      >
        {dashboardExternalHelper.showFileACase
          ? 'File a Case'
          : 'Create a Case'}
      </Button>
    );

    const renderCaseListTable = ({
      cases = [],
      showLoadMore,
      showMoreResultsSequence,
      tabName,
    }: {
      cases: TAssociatedCaseFormatted[];
      showLoadMore: boolean;
      showMoreResultsSequence: boolean;
      tabName: string;
    }) => {
      return (
        <>
          {!cases?.length && <p>You have no {tabName.toLowerCase()} cases.</p>}
          {cases?.length > 0 && (
            <>
              <table
                className="usa-table responsive-table dashboard"
                data-testid="case-list-table"
                id="case-list"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="usa-sr-only">Lead Case Indicator</span>
                    </th>
                    <th>Docket No.</th>
                    <th>Case Title</th>
                    <th>Filed Date</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map(item => (
                    <CaseListRowExternal
                      onlyLinkIfRequestedUserAssociated
                      formattedCase={item}
                      key={item.docketNumber}
                    />
                  ))}
                </tbody>
              </table>
              {showLoadMore && (
                <Button
                  secondary
                  className="margin-bottom-20"
                  margin-direction="bottom"
                  onClick={() => {
                    showMoreResultsSequence();
                  }}
                >
                  Load More
                </Button>
              )}
            </>
          )}
        </>
      );
    };

    return (
      <>
        <WarningNotification />
        <NonMobile>
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
                      cases: externalUserCasesHelper.openCaseResults,
                      showLoadMore:
                        externalUserCasesHelper.showLoadMoreOpenCases,
                      showMoreResultsSequence: showMoreOpenCasesSequence,
                      tabName: openTab,
                    })}
                  </Tab>
                  <Tab
                    data-testid="closed-cases-count"
                    id="tab-closed"
                    tabName={closedTab}
                    title={`Closed Cases (${externalUserCasesHelper.closedCasesCount})`}
                  >
                    {renderCaseListTable({
                      cases: externalUserCasesHelper.closedCaseResults,
                      showLoadMore:
                        externalUserCasesHelper.showLoadMoreClosedCases,
                      showMoreResultsSequence: showMoreClosedCasesSequence,
                      tabName: closedTab,
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
        </NonMobile>
        <Mobile>
          <div className="grid-container padding-x-0">
            <div className="grid-row">{renderStartButton()}</div>
            <div className="grid-row">
              <select
                aria-label="additional case info"
                className="usa-select"
                id="mobile-case-type-tab-selector"
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
                  cases: externalUserCasesHelper.closedCaseResults,
                  showLoadMore: externalUserCasesHelper.showLoadMoreClosedCases,
                  showMoreResultsSequence: showMoreClosedCasesSequence,
                  tabName: closedTab,
                })}
              {caseType === openTab &&
                renderCaseListTable({
                  cases: externalUserCasesHelper.openCaseResults,
                  showLoadMore: externalUserCasesHelper.showLoadMoreOpenCases,
                  showMoreResultsSequence: showMoreOpenCasesSequence,
                  tabName: openTab,
                })}
            </div>
          </div>
        </Mobile>
      </>
    );
  },
);

CaseListTable.displayName = 'CaseListTable';
