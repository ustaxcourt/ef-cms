import { Button } from '../ustc-ui/Button/Button';
import { CaseListRowExternal } from './CaseListRowExternal';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { WarningNotification } from './WarningNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseListPetitioner = connect(
  {
    externalUserCasesHelper: state.externalUserCasesHelper,
    pageSize: state.constants.CASE_LIST_PAGE_SIZE,
    showMoreClosedCasesSequence: sequences.showMoreClosedCasesSequence,
    showMoreOpenCasesSequence: sequences.showMoreOpenCasesSequence,
  },
  function CaseListPetitioner({
    externalUserCasesHelper,
    pageSize,
    showMoreClosedCasesSequence,
    showMoreOpenCasesSequence,
  }) {
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
          {!cases?.length && <p>You have no {tabName} cases.</p>}
          {cases.length > 0 && (
            <div className="margin-top-2">
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
                  onClick={() => {
                    showMoreResultsSequence();
                  }}
                >
                  Load {pageSize} more
                </Button>
              )}
            </div>
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
                  defaultActiveTab="Open"
                >
                  <Tab
                    id="tab-open"
                    tabName="Open"
                    title={`Open Cases (${externalUserCasesHelper.openCaseResults.length})`}
                  >
                    {renderCaseListTable({
                      cases: externalUserCasesHelper.openCaseResults,
                      showLoadMore:
                        externalUserCasesHelper.showLoadMoreOpenCases,
                      showMoreResultsSequence: showMoreOpenCasesSequence,
                      tabName: 'open',
                    })}
                  </Tab>
                  <Tab
                    id="tab-closed"
                    tabName="Closed"
                    title={`Closed Cases (${externalUserCasesHelper.closedCaseResults.length})`}
                  >
                    {renderCaseListTable({
                      cases: externalUserCasesHelper.closedCaseResults,
                      showLoadMore:
                        externalUserCasesHelper.showLoadMoreClosedCases,
                      showMoreResultsSequence: showMoreClosedCasesSequence,
                      tabName: 'closed',
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
              <Tabs
                bind="currentViewMetadata.caseList.tab"
                className="classic-horizontal-header3 no-border-bottom"
                defaultActiveTab="Open"
              >
                <Tab
                  id="tab-open"
                  tabName="Open"
                  title={`Open Cases (${externalUserCasesHelper.openCaseResults.length})`}
                >
                  {renderCaseListTable({
                    cases: externalUserCasesHelper.openCaseResults,
                    showLoadMore: externalUserCasesHelper.showLoadMoreOpenCases,
                    showMoreResultsSequence: showMoreOpenCasesSequence,
                    tabName: 'open',
                  })}
                </Tab>
                <Tab
                  id="tab-closed"
                  tabName="Closed"
                  title={`Closed Cases (${externalUserCasesHelper.closedCaseResults.length})`}
                >
                  {renderCaseListTable({
                    cases: externalUserCasesHelper.closedCaseResults,
                    showLoadMore:
                      externalUserCasesHelper.showLoadMoreClosedCases,
                    showMoreResultsSequence: showMoreClosedCasesSequence,
                    tabName: 'closed',
                  })}
                </Tab>
              </Tabs>
            </div>
          </div>
        </Mobile>
      </>
    );
  },
);
