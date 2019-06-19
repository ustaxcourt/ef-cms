import { ActionRequired } from './CaseDetail/ActionRequired';
import { CaseInformationPublic } from './CaseDetail/CaseInformationPublic';
import { DocketRecord } from './DocketRecord/DocketRecord';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PartyInformation } from './CaseDetail/PartyInformation';
import { SuccessNotification } from './SuccessNotification';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import React from 'react';

export const CaseDetail = connect(
  {
    caseDetail: state.formattedCaseDetail,
    caseHelper: state.caseDetailHelper,
    setDocumentDetailTabSequence: sequences.setDocumentDetailTabSequence,
    showDetails: state.paymentInfo.showDetails,
    togglePaymentDetailsSequence: sequences.togglePaymentDetailsSequence,
  },
  function CaseDetail({
    caseDetail,
    caseHelper,
    setDocumentDetailTabSequence,
  }) {
    return (
      <React.Fragment>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <h1 className="heading-2 captioned" tabIndex="-1">
                  Docket Number: {caseDetail.docketNumberWithSuffix}
                </h1>
                <p className="margin-0">{caseDetail.caseTitle}</p>
              </div>
              <div className="tablet:grid-col-6">
                {caseHelper.showRequestAccessToCaseButton && (
                  <a
                    className="usa-button tablet-full-width push-right margin-right-0"
                    href={`/case-detail/${caseDetail.docketNumber}/request-access`}
                    id="button-request-access"
                  >
                    Request Access to Case
                  </a>
                )}
                {caseHelper.showPendingAccessToCaseButton && (
                  <span
                    aria-label="Request for Access Pending"
                    className="usa-tag push-right margin-right-0 padding-x-3"
                  >
                    <span aria-hidden="true">Request for Access Pending</span>
                  </span>
                )}
                {caseHelper.showFileFirstDocumentButton && (
                  <a
                    className="usa-button tablet-full-width push-right margin-right-0"
                    href={`/case-detail/${caseDetail.docketNumber}/file-a-document`}
                    id="button-first-irs-document"
                  >
                    <FontAwesomeIcon icon="file" size="1x" /> File First IRS
                    Document
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          {caseHelper.showActionRequired && (
            <div className="margin-bottom-6">
              <div className="title">
                <h1>Action Required</h1>
              </div>
              <ActionRequired />
            </div>
          )}
          <div className="only-small-screens">
            <div className="margin-bottom-3">
              <select
                aria-label="additional case info"
                className="usa-select"
                id="mobile-document-detail-tab-selector"
                name="partyType"
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
              bind="documentDetail.tab"
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
                {caseHelper.showCaseInformationPublic && (
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
