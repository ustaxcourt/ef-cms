import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseInformationInternal } from './CaseDetail/CaseInformationInternal';
import { DocketRecord } from './DocketRecord/DocketRecord';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MessagesInProgress } from './CaseDetail/MessagesInProgress';
import { PartyInformation } from './CaseDetail/PartyInformation';
import { SuccessNotification } from './SuccessNotification';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDetailInternal = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    caseHelper: state.caseDetailHelper,
    setCaseToReadyForTrialSequence: sequences.setCaseToReadyForTrialSequence,
    setDocumentDetailTabSequence: sequences.setDocumentDetailTabSequence,
    token: state.token,
  },
  ({
    baseUrl,
    caseDetail,
    caseHelper,
    setCaseToReadyForTrialSequence,
    setDocumentDetailTabSequence,
    token,
  }) => {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div>
            <div className="title">
              <h1>Messages in Progress</h1>
            </div>
            <MessagesInProgress />
          </div>
          <div className="only-small-screens">
            <div className="margin-bottom-3">
              <select
                className="usa-select"
                id="mobile-document-detail-tab-selector"
                name="partyType"
                aria-label="additional case info"
                value={caseHelper.documentDetailTab}
                onChange={e => {
                  setDocumentDetailTabSequence({
                    tab: e.target.value,
                  });
                }}
              >
                <option value="docketRecord">Docket Record</option>
                <option value="caseInfo">Case Information</option>
              </select>
            </div>
          </div>
          <div className="mobile-document-detail-tabs">
            <Tabs
              className="classic-horizontal-header3 tab-border"
              bind="documentDetail.tab"
            >
              <Tab
                tabName="docketRecord"
                title="Docket Record"
                id="tab-docket-record"
              >
                <DocketRecord />
              </Tab>
              <Tab
                tabName="caseInfo"
                title="Case Information"
                id="tab-case-info"
              >
                <CaseInformationInternal />
                <div className="case-detail-party-info">
                  <PartyInformation />
                </div>
              </Tab>
            </Tabs>
          </div>
        </section>
        {/* This section below will be removed in a future story */}
        <section className="usa-section grid-container">
          {caseDetail.status === 'General Docket - Not at Issue' && (
            <>
              {caseDetail.contactPrimary && (
                <a
                  href={`${baseUrl}/documents/${
                    caseDetail.docketNumber
                  }_${caseDetail.contactPrimary.name.replace(
                    /\s/g,
                    '_',
                  )}.zip/documentDownloadUrl?token=${token}`}
                  aria-label="View PDF"
                >
                  <FontAwesomeIcon icon={['far', 'file-pdf']} />
                  Batch Zip Download
                </a>
              )}
              <button
                className="usa-button usa-button--outline margin-left-1"
                onClick={() => setCaseToReadyForTrialSequence()}
              >
                Set Case Status to Ready for Trial
              </button>
            </>
          )}
        </section>
      </>
    );
  },
);
