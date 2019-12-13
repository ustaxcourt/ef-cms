import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseDetailSubnavTabs } from './CaseDetailSubnavTabs';
import { CaseInformationExternal } from './CaseInformationExternal';
import { DocketRecord } from '../DocketRecord/DocketRecord';
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
    caseDetailHelper: state.caseDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    primaryTab: state.caseDetailPage.primaryTab,
    setCaseDetailPageTabSequence: sequences.setCaseDetailPageTabSequence,
  },
  function CaseDetail({
    caseDetailHelper,
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
          <div className="only-small-screens">
            <div className="margin-bottom-3">
              <select
                aria-label="additional case info"
                className="usa-select"
                id="mobile-document-detail-tab-selector"
                name="partyType"
                value={caseDetailHelper.documentDetailTab}
                onChange={e => {
                  setCaseDetailPageTabSequence({
                    tab: e.target.value,
                  });
                }}
              >
                <option value="docketRecord">Docket Record</option>
                <option value="caseInformation">Case Information</option>
              </select>
            </div>
          </div>
          {primaryTab === 'docketRecord' && (
            <>
              <div className="title">
                <h1>Docket Record</h1>
              </div>
              <DocketRecord />
            </>
          )}
          {primaryTab === 'caseInformation' && (
            <Tabs
              bind="caseDetailPage.caseInformationTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab id="tab-overview" tabName="overview" title="Overview">
                <CaseInformationExternal />
              </Tab>
              <Tab id="tab-petitioner" tabName="petitioner" title="Petitioner">
                <PetitionerInformation />
              </Tab>
              <Tab id="tab-respondent" tabName="respondent" title="Respondent">
                <RespondentInformation />
              </Tab>
            </Tabs>
          )}
        </section>
      </React.Fragment>
    );
  },
);
