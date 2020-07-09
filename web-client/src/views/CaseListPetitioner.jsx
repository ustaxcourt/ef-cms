import { Button } from '../ustc-ui/Button/Button';
import { CaseListRowExternal } from './CaseListRowExternal';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { WarningNotification } from './WarningNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const CaseListPetitioner = connect(
  {
    caseType: state.openClosedCases.caseType,
    clearOpenClosedCasesCurrentPageSequence:
      sequences.clearOpenClosedCasesCurrentPageSequence,
    closedTab: state.constants.EXTERNAL_USER_DASHBOARD_TABS.CLOSED,
    externalUserCasesHelper: state.externalUserCasesHelper,
    openTab: state.constants.EXTERNAL_USER_DASHBOARD_TABS.OPEN,
    setCaseTypeToDisplaySequence: sequences.setCaseTypeToDisplaySequence,
    showMoreClosedCasesSequence: sequences.showMoreClosedCasesSequence,
    showMoreOpenCasesSequence: sequences.showMoreOpenCasesSequence,
  },
  function CaseListPetitioner({
    caseType,
    clearOpenClosedCasesCurrentPageSequence,
    closedTab,
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
        href="/before-filing-a-petition"
        icon="file"
        id="file-a-petition"
      >
        Create a Case
      </Button>
    );

    const renderCaseListTable = ({
      cases,
      showLoadMore,
      showMoreResultsSequence,
      tabName,
    }) => {
      return (
        <>
          {!cases?.length && <p>You have no {tabName.toLowerCase()} cases.</p>}
          {cases.length > 0 && (
            <>
              <table
                className="usa-table responsive-table dashboard"
                id="case-list"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="usa-sr-only">Lead Case Indicator</span>
                    </th>
                    <th>Docket number</th>
                    <th>Case title</th>
                    <th>Date filed</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map(item => (
                    <CaseListRowExternal
                      onlyLinkIfRequestedUserAssociated
                      formattedCase={item}
                      key={item.caseId}
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
        <WarningNotification
          alertWarning={{ message: 'Hi', title: 'Hello there' }}
        />
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
                    {renderStartButton()}
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
