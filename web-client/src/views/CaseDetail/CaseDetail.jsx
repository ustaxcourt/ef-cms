import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseDetailSubnavTabs } from './CaseDetailSubnavTabs';
import { CaseInformationExternal } from './CaseInformationExternal';
import { DocketRecord } from '../DocketRecord/DocketRecord';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';

import { ErrorNotification } from '../ErrorNotification';
import { PetitionerInformation } from './PetitionerInformation';
import { RespondentInformation } from './RespondentInformation';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDetail = connect(
  {
    caseDetailSubnavHelper: state.caseDetailSubnavHelper,
    caseInformationTab: state.caseDetailPage.caseInformationTab,
    formattedCaseDetail: state.formattedCaseDetail,
    primaryTab: state.caseDetailPage.primaryTab,
    setCaseDetailPageTabSequence: sequences.setCaseDetailPageTabSequence,
  },
  function CaseDetail({
    caseDetailSubnavHelper,
    caseInformationTab,
    primaryTab,
    setCaseDetailPageTabSequence,
  }) {
    return (
      <React.Fragment>
        <CaseDetailHeader className="margin-bottom-0" />
        <CaseDetailSubnavTabs />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          {caseDetailSubnavHelper.showCaseInformationTab && (
            <div className="only-small-screens">
              <div className="margin-bottom-3">
                <select
                  aria-label="additional case info"
                  className="usa-select"
                  id="mobile-document-detail-tab-selector"
                  onChange={e => {
                    setCaseDetailPageTabSequence({
                      isSecondary: [
                        'overview',
                        'petitioner',
                        'respondent',
                      ].includes(e.target.value),
                      tab: e.target.value,
                    });
                  }}
                >
                  <option value="docketRecord">Docket Record</option>
                  <optgroup label="Case Information">
                    <option value="overview">Overview</option>
                    <option value="petitioner">Petitioner</option>
                    <option value="respondent">Respondent</option>
                  </optgroup>
                </select>
              </div>
            </div>
          )}
          {primaryTab === 'docketRecord' && (
            <>
              <div className="title">
                <h1>Docket Record</h1>
              </div>
              <DocketRecord />
            </>
          )}
          {caseDetailSubnavHelper.showCaseInformationTab &&
            primaryTab === 'caseInformation' && (
              <>
                <NonMobile>
                  <Tabs
                    bind="caseDetailPage.caseInformationTab"
                    className="classic-horizontal-header3 tab-border"
                  >
                    <Tab id="tab-overview" tabName="overview" title="Overview">
                      <CaseInformationExternal />
                    </Tab>
                    <Tab
                      id="tab-petitioner"
                      tabName="petitioner"
                      title="Petitioner"
                    >
                      <PetitionerInformation />
                    </Tab>
                    <Tab
                      id="tab-respondent"
                      tabName="respondent"
                      title="Respondent"
                    >
                      <RespondentInformation />
                    </Tab>
                  </Tabs>
                </NonMobile>
                <Mobile>
                  <Tabs
                    bind="caseDetailPage.caseInformationTab"
                    className="classic-horizontal-header3 tab-border"
                  >
                    {caseInformationTab === 'overview' && (
                      <Tab
                        id="tab-overview"
                        tabName="overview"
                        title="Overview"
                      >
                        <CaseInformationExternal />
                      </Tab>
                    )}
                    {caseInformationTab === 'petitioner' && (
                      <Tab
                        id="tab-petitioner"
                        tabName="petitioner"
                        title="Petitioner"
                      >
                        <PetitionerInformation />
                      </Tab>
                    )}
                    {caseInformationTab === 'respondent' && (
                      <Tab
                        id="tab-respondent"
                        tabName="respondent"
                        title="Respondent"
                      >
                        <RespondentInformation />
                      </Tab>
                    )}
                  </Tabs>
                </Mobile>
              </>
            )}
        </section>
      </React.Fragment>
    );
  },
);
