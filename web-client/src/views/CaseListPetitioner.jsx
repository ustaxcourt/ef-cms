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
    externalUserClosedCasesHelper: state.externalUserClosedCasesHelper,
    externalUserOpenCasesHelper: state.externalUserOpenCasesHelper,
    getCasesByStatusForUserSequence: sequences.getCasesByStatusForUserSequence,
    pageSize: state.constants.CASE_LIST_PAGE_SIZE,
    showMoreClosedCasesSequence: sequences.showMoreClosedCasesSequence,
    showMoreOpenCasesSequence: sequences.showMoreOpenCasesSequence,
  },
  function CaseListPetitioner({
    externalUserClosedCasesHelper,
    externalUserOpenCasesHelper,
    getCasesByStatusForUserSequence,
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

    const renderCaseListTable = (
      cases,
      externalUserCasesHelper,
      showMoreResultsSequence,
    ) => (
      <div className="margin-top-2">
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
        {externalUserCasesHelper.showLoadMore && (
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
    );

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
                  <Tab id="tab-open" tabName="Open" title="Open Cases">
                    {renderCaseListTable(
                      externalUserOpenCasesHelper.caseResults,
                      externalUserOpenCasesHelper,
                      showMoreOpenCasesSequence,
                    )}
                  </Tab>
                  <Tab id="tab-closed" tabName="Closed" title="Closed Cases">
                    {renderCaseListTable(
                      externalUserClosedCasesHelper.caseResults,
                      externalUserClosedCasesHelper,
                      showMoreClosedCasesSequence,
                    )}
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
                onSelect={() => {
                  getCasesByStatusForUserSequence();
                }}
              >
                <Tab id="tab-open" tabName="Open" title="Open">
                  {renderCaseListTable(
                    externalUserOpenCasesHelper.caseResults,
                    externalUserOpenCasesHelper,
                    showMoreOpenCasesSequence,
                  )}
                </Tab>
                <Tab id="tab-closed" tabName="Closed" title="Closed">
                  {renderCaseListTable(
                    externalUserClosedCasesHelper.caseResults,
                    externalUserClosedCasesHelper,
                    showMoreClosedCasesSequence,
                  )}
                </Tab>
              </Tabs>
            </div>
          </div>
        </Mobile>
      </>
    );
  },
);
