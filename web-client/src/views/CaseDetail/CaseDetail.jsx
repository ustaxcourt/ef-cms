import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseDetailSubnavTabs } from './CaseDetailSubnavTabs';
import { CaseInformationExternal } from './CaseInformationExternal';
import { DocketRecord } from '../DocketRecord/DocketRecord';
import { ErrorNotification } from '../ErrorNotification';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { OtherFilerInformation } from './OtherFilerInformation';
import { PetitionerInformation } from './PetitionerInformation';
import { RespondentInformation } from './RespondentInformation';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDetail = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    caseDetailSubnavHelper: state.caseDetailSubnavHelper,
    caseInformationTab: state.currentViewMetadata.caseDetail.caseInformationTab,
    primaryTab: state.currentViewMetadata.caseDetail.primaryTab,
    setCaseDetailPageTabSequence: sequences.setCaseDetailPageTabSequence,
  },
  function CaseDetail({
    caseDetailHelper,
    caseDetailSubnavHelper,
    caseInformationTab,
    primaryTab,
    setCaseDetailPageTabSequence,
  }) {
    return (
      <>
        <CaseDetailHeader className="margin-bottom-0" />

        {caseDetailHelper.userCanViewCase && (
          <>
            <CaseDetailSubnavTabs />

            <section className="usa-section grid-container">
              <SuccessNotification />
              <ErrorNotification />
              {caseDetailHelper.showPetitionProcessingAlert && (
                <div
                  aria-live="polite"
                  className="usa-alert usa-alert--warning"
                  role="alert"
                >
                  <div className="usa-alert__body">
                    You will be able to file documents after the Petition is
                    processed.
                  </div>
                </div>
              )}
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
                            'otherFiler',
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
                        <option value="otherFiler">Other</option>
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
                        bind="currentViewMetadata.caseDetail.caseInformationTab"
                        className="classic-horizontal-header3 tab-border"
                      >
                        <Tab
                          id="tab-overview"
                          tabName="overview"
                          title="Overview"
                        >
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
                        <Tab
                          id="tab-other-filer"
                          tabName="otherFiler"
                          title="Other"
                        >
                          <OtherFilerInformation />
                        </Tab>
                      </Tabs>
                    </NonMobile>
                    <Mobile>
                      <Tabs
                        bind="currentViewMetadata.caseDetail.caseInformationTab"
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
                        {caseInformationTab === 'otherFiler' && (
                          <Tab
                            id="tab-other-filer"
                            tabName="otherFiler"
                            title="Other"
                          >
                            <OtherFilerInformation />
                          </Tab>
                        )}
                      </Tabs>
                    </Mobile>
                  </>
                )}
            </section>
          </>
        )}
        {!caseDetailHelper.userCanViewCase && (
          <section className="usa-section grid-container">
            <p>
              If you are counsel representing a party in this case, you must
              file an Entry of Appearance by paper.
            </p>
          </section>
        )}
      </>
    );
  },
);
