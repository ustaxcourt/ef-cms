import { Button } from '../ustc-ui/Button/Button';
import { CaseListRowExternal } from './CaseListRowExternal';
import { CaseSearchBox } from './CaseSearchBox';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { MyContactInformation } from './MyContactInformation';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseListRespondent = connect(
  {
    dashboardExternalHelper: state.dashboardExternalHelper,
    externalUserOpenCasesHelper: state.externalUserOpenCasesHelper,
    formattedCases: state.formattedCases,
    getCasesByStatusForUserSequence: sequences.getCasesByStatusForUserSequence,
    pageSize: state.constants.CASE_LIST_PAGE_SIZE,
  },
  function CaseListRespondent({
    dashboardExternalHelper,
    externalUserOpenCasesHelper,
    formattedCases,
    getCasesByStatusForUserSequence,
    pageSize,
  }) {
    const renderTable = () => (
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
            {formattedCases.map(item => (
              <CaseListRowExternal
                onlyLinkIfRequestedUserAssociated
                formattedCase={item}
                key={item.caseId}
              />
            ))}
          </tbody>
        </table>
        {externalUserOpenCasesHelper.showLoadMore && (
          <Button secondary onClick={() => {}}>
            Load {pageSize} more
          </Button>
        )}
      </>
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
                  onSelect={() => {
                    getCasesByStatusForUserSequence();
                  }}
                >
                  <Tab id="tab-open" tabName="Open" title="Open Cases">
                    {renderTable()}
                  </Tab>
                  <Tab id="tab-closed" tabName="Closed" title="Closed Cases">
                    {renderTable()}
                  </Tab>
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
            <div className="grid-row">
              <Tabs
                bind="currentViewMetadata.caseList.tab"
                className="classic-horizontal-header3 no-border-bottom"
                defaultActiveTab="Open"
                onSelect={() => {
                  getCasesByStatusForUserSequence();
                }}
              >
                <Tab id="tab-open" tabName="Open" title="Open Cases">
                  {renderTable()}
                </Tab>
                <Tab id="tab-closed" tabName="Closed" title="Closed Cases">
                  {renderTable()}
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
