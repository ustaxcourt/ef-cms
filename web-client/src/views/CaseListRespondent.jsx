import { Button } from '../ustc-ui/Button/Button';
import { CaseListRowExternal } from './CaseListRowExternal';
import { CaseSearchBox } from './CaseSearchBox';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { MyContactInformation } from './MyContactInformation';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseListRespondent = connect(
  {
    dashboardExternalHelper: state.dashboardExternalHelper,
    formattedCases: state.formattedCases,
  },
  function CaseListRespondent({ dashboardExternalHelper, formattedCases }) {
    const renderTable = () => (
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
    );

    const renderTabs = () => (
      <>
        <NonMobile>
          <div className="grid-container padding-x-0">
            <div className="grid-row">
              <div className="grid-column-auto">
                <Tabs className="classic-horizontal-header3 no-border-bottom">
                  <Tab id="tab-open" tabName="open" title="Open"></Tab>
                  <Tab id="tab-closed" tabName="closed" title="Closed"></Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </NonMobile>
        <Mobile>
          <div className="grid-container padding-x-0">
            <div className="grid-row">
              <div className="grid-column-auto">
                <Tabs className="classic-horizontal-header3 no-border-bottom">
                  <Tab id="tab-open" tabName="open" title="Open"></Tab>
                  <Tab id="tab-closed" tabName="closed" title="Closed"></Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </Mobile>
      </>
    );

    const renderEmptyState = () => (
      <>
        {renderTabs()}
        <p>You are not associated with any cases.</p>
      </>
    );

    const renderNonEmptyState = () => (
      <>
        {renderTabs()}
        {renderTable()}
      </>
    );

    return (
      <>
        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap-6">
            <div className="tablet:grid-col-8">
              {dashboardExternalHelper.showCaseList
                ? renderNonEmptyState()
                : renderEmptyState()}
            </div>
            <div className="tablet:grid-col-4">
              <CaseSearchBox />
              <MyContactInformation />
            </div>
          </div>
        </div>
      </>
    );
  },
);
