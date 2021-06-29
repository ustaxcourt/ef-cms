import { Accordion, AccordionItem } from '../ustc-ui/Accordion/Accordion';
import { Button } from '../ustc-ui/Button/Button';
import { CaseListRowExternal } from './CaseListRowExternal';
import { CaseSearchBox } from './CaseSearchBox';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const CaseListPractitioner = connect(
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
  function CaseListPractitioner({
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

    const renderTable = (
      cases,
      showLoadMore,
      showMoreResultsSequence,
      tabName,
    ) => (
      <>
        {!cases?.length && <p>You have no {tabName.toLowerCase()} cases.</p>}
        {cases?.length > 0 && (
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
                  key={item.docketNumber}
                />
              ))}
            </tbody>
          </table>
        )}
        {showLoadMore && (
          <Button
            secondary
            className="margin-bottom-20"
            onClick={() => {
              showMoreResultsSequence();
            }}
          >
            Load More
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
                  defaultActiveTab={openTab}
                >
                  <Tab
                    id="tab-open"
                    tabName={openTab}
                    title={`Open Cases (${externalUserCasesHelper.openCasesCount})`}
                  >
                    {renderTable(
                      externalUserCasesHelper.openCaseResults,
                      externalUserCasesHelper.showLoadMoreOpenCases,
                      showMoreOpenCasesSequence,
                      openTab,
                    )}
                  </Tab>
                  <Tab
                    id="tab-closed"
                    tabName={closedTab}
                    title={`Closed Cases (${externalUserCasesHelper.closedCasesCount})`}
                  >
                    {renderTable(
                      externalUserCasesHelper.closedCaseResults,
                      externalUserCasesHelper.showLoadMoreClosedCases,
                      showMoreClosedCasesSequence,
                      closedTab,
                    )}
                  </Tab>
                  <div className="ustc-ui-tabs ustc-ui-tabs--right-button-container">
                    {renderStartButton()}
                  </div>
                </Tabs>
              </div>
              <div className="grid-col-4">
                {dashboardExternalHelper.showCaseSearch && <CaseSearchBox />}
                <div className="card">
                  <div className="content-wrapper gray">
                    <h3>Filing Fee Options</h3>
                    <hr />
                    <p>
                      <strong>Pay by debit/credit card</strong>
                      <br />
                      Copy your docket number(s) and pay online.
                      <br />
                      <Button
                        className="margin-bottom-3 margin-top-2"
                        href="https://pay.gov/public/form/start/60485840"
                        id="pay_filing_fee"
                        target="_blank"
                      >
                        Pay now
                      </Button>
                    </p>
                    <hr />

                    <Accordion gray headingLevel="3">
                      <AccordionItem
                        customClassName="payment-options"
                        key={'other-options accordion-icon'}
                        title={'Other options'}
                      >
                        <hr />
                        <strong>Mail-in payment</strong>
                        <br />
                        Make checks/money orders payable to:
                        <br />
                        Clerk, United States Tax Court
                        <br />
                        400 Second Street, NW
                        <br />
                        Washington, DC 20217
                        <br />
                        <br />
                        <strong>Can’t afford to pay the filing fee?</strong>
                        <Button
                          link
                          className="usa-link--external text-left"
                          href="https://www.ustaxcourt.gov/resources/forms/Application_for_Waiver_of_Filing_Fee.pdf"
                          icon="file-pdf"
                          iconColor="blue"
                          rel="noopener noreferrer"
                          shouldWrapText={true}
                          target="_blank"
                        >
                          Download Application For Waiver of Filing Fee
                        </Button>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
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
                renderTable(
                  externalUserCasesHelper.closedCaseResults,
                  externalUserCasesHelper.showLoadMoreClosedCases,
                  showMoreClosedCasesSequence,
                  closedTab,
                )}
              {caseType === openTab &&
                renderTable(
                  externalUserCasesHelper.openCaseResults,
                  externalUserCasesHelper.showLoadMoreOpenCases,
                  showMoreOpenCasesSequence,
                  openTab,
                )}
            </div>
            <div className="grid-row display-block">
              {dashboardExternalHelper.showCaseSearch && <CaseSearchBox />}
              <div className="card">
                <div className="content-wrapper gray">
                  <h3>Filing Fee Options</h3>
                  <hr />
                  <p>
                    <strong>Pay by debit/credit card</strong>
                    <br />
                    Copy your docket number(s) and pay online.
                    <br />
                    <Button
                      className="margin-bottom-3 margin-top-2"
                      href="https://pay.gov/public/form/start/60485840"
                      id="pay_filing_fee"
                      target="_blank"
                    >
                      Pay now
                    </Button>
                  </p>
                  <hr />

                  <Accordion gray headingLevel="3">
                    <AccordionItem
                      customClassName="payment-options"
                      key={'other-options accordion-icon'}
                      title={'Other options'}
                    >
                      <hr />
                      <strong>Mail-in payment</strong>
                      <br />
                      Make checks/money orders payable to:
                      <br />
                      Clerk, United States Tax Court
                      <br />
                      400 Second Street, NW
                      <br />
                      Washington, DC 20217
                      <br />
                      <br />
                      <strong>Can’t afford to pay the filing fee?</strong>
                      <Button
                        link
                        className="usa-link--external text-left"
                        href="https://www.ustaxcourt.gov/resources/forms/Application_for_Waiver_of_Filing_Fee.pdf"
                        icon="file-pdf"
                        iconColor="blue"
                        rel="noopener noreferrer"
                        shouldWrapText={true}
                        target="_blank"
                      >
                        Download Application For Waiver of Filing Fee
                      </Button>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </Mobile>
      </>
    );
  },
);
