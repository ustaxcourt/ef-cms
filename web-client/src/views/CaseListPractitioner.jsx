import { Button } from '../ustc-ui/Button/Button';
import { CaseListRowExternal } from './CaseListRowExternal';
import { CaseSearchBox } from './CaseSearchBox';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { MyContactInformation } from './MyContactInformation';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseListPractitioner = connect(
  {
    dashboardExternalHelper: state.dashboardExternalHelper,
    externalUserCasesHelper: state.externalUserCasesHelper,
    pageSize: state.constants.CASE_LIST_PAGE_SIZE,
    showMoreClosedCasesSequence: sequences.showMoreClosedCasesSequence,
    showMoreOpenCasesSequence: sequences.showMoreOpenCasesSequence,
  },
  function CaseListPractitioner({
    dashboardExternalHelper,
    externalUserCasesHelper,
    pageSize,
    showMoreClosedCasesSequence,
    showMoreOpenCasesSequence,
  }) {
    const renderTable = (cases, showLoadMore, showMoreResultsSequence) => (
      <>
        <table className="usa-table responsive-table dashboard" id="case-list">
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
      </>
    );

    const renderStartButton = () => (
      <Button
        className="margin-top-1 margin-right-0"
        href="/file-a-petition/step-1"
        icon="file"
        id="file-a-petition"
      >
        File a Case
      </Button>
    );

    return (
      <>
        <NonMobile>
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-8">
                <Tabs
                  bind="currentViewMetadata.caseList.tab"
                  className="classic-horizontal-header3 no-border-bottom"
                  defaultActiveTab="Open"
                >
                  <Tab id="tab-open" tabName="Open" title="Open Cases">
                    {renderTable(
                      externalUserCasesHelper.openCaseResults,
                      externalUserCasesHelper.showLoadMoreOpenCases,
                      showMoreOpenCasesSequence,
                    )}
                  </Tab>
                  <Tab id="tab-closed" tabName="Closed" title="Closed Cases">
                    {renderTable(
                      externalUserCasesHelper.closedCaseResults,
                      externalUserCasesHelper.showLoadMoreClosedCases,
                      showMoreClosedCasesSequence,
                    )}
                  </Tab>
                  <div className="ustc-ui-tabs ustc-ui-tabs--right-button-container">
                    {renderStartButton()}
                  </div>
                </Tabs>
              </div>
              <div className="grid-col-4">
                {dashboardExternalHelper.showCaseSearch && <CaseSearchBox />}
                <MyContactInformation />
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
                <Tab id="tab-open" tabName="Open" title="Open Cases">
                  {renderTable(
                    externalUserCasesHelper.openCaseResults,
                    externalUserCasesHelper.showLoadMoreOpenCases,
                    showMoreOpenCasesSequence,
                  )}
                </Tab>
                <Tab id="tab-closed" tabName="Closed" title="Closed Cases">
                  {renderTable(
                    externalUserCasesHelper.closedCaseResults,
                    externalUserCasesHelper.showLoadMoreClosedCases,
                    showMoreClosedCasesSequence,
                  )}
                </Tab>
              </Tabs>
            </div>
            <div className="grid-row">
              {dashboardExternalHelper.showCaseSearch && <CaseSearchBox />}
              <MyContactInformation />
            </div>
          </div>
        </Mobile>
      </>
    );
  },
);
