import { ActionRequired } from './CaseDetail/ActionRequired';
import { CaseDeadlinesExternal } from './CaseDetail/CaseDeadlinesExternal';
import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseInformationPublic } from './CaseDetail/CaseInformationPublic';
import { DocketRecord } from './DocketRecord/DocketRecord';
import { ErrorNotification } from './ErrorNotification';
import { PartyInformation } from './CaseDetail/PartyInformation';
import { SuccessNotification } from './SuccessNotification';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import React from 'react';

export const CaseDetail = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    setCaseDetailPageTabSequence: sequences.setCaseDetailPageTabSequence,
  },
  function CaseDetail({ caseDetailHelper, setCaseDetailPageTabSequence }) {
    return (
      <React.Fragment>
        <CaseDetailHeader />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          {caseDetailHelper.showActionRequired && (
            <div className="margin-bottom-6">
              <div className="title">
                <h1>Action Required</h1>
              </div>
              <ActionRequired />
            </div>
          )}
          <CaseDeadlinesExternal />
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
                <option value="caseInfo">Case Information</option>
              </select>
            </div>
          </div>
          <div className="case-detail-primary-tabs__tabs">
            <Tabs
              bind="caseDetailPage.informationTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab
                id="tab-docket-record"
                tabName="docketRecord"
                title="Docket Record"
              >
                <DocketRecord />
              </Tab>
              <Tab
                id="tab-case-info"
                tabName="caseInfo"
                title="Case Information"
              >
                {caseDetailHelper.showCaseInformationPublic && (
                  <CaseInformationPublic />
                )}
                <div className="case-detail-party-info">
                  <PartyInformation />
                </div>
              </Tab>
            </Tabs>
          </div>
        </section>
      </React.Fragment>
    );
  },
);
