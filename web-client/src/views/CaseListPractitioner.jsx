import { Button } from '../ustc-ui/Button/Button';
import { CaseListRowExternal } from './CaseListRowExternal';
import { CaseSearchBox } from './CaseSearchBox';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { MyContactInformation } from './MyContactInformation';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseListPractitioner = connect(
  {
    dashboardExternalHelper: state.dashboardExternalHelper,
    formattedCases: state.formattedCases,
  },
  function CaseListPractitioner({ dashboardExternalHelper, formattedCases }) {
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

    const renderTabs = () => (
      <>
        <NonMobile>
          <div className="grid-container padding-x-0">
            <div className="grid-row">
              <div className="grid-column-auto">
                <Tabs
                  buttonLink=""
                  className="classic-horizontal-header3 no-border-bottom"
                >
                  <Tab id="tab-open" tabName="open" title="Open"></Tab>
                  <Tab id="tab-closed" tabName="closed" title="Closed"></Tab>
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
      <React.Fragment>
        {renderTabs()}
        <p className="margin-bottom-5">
          You are not associated with any cases.
        </p>
      </React.Fragment>
    );

    const renderNonEmptyState = () => (
      <React.Fragment>
        {renderTabs()}
        {renderTable()}
      </React.Fragment>
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
              {dashboardExternalHelper.showCaseSearch && <CaseSearchBox />}
              <MyContactInformation />
            </div>
          </div>
        </div>
      </>
    );
  },
);
