import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { state } from 'cerebral';
import React from 'react';

import { DocketRecord } from './DocketRecord';
import { ErrorNotification } from './ErrorNotification';
import { FileDocument } from './FileDocument';
import { PartyInformation } from './PartyInformation';
import { SuccessNotification } from './SuccessNotification';

export const CaseDetailRespondent = connect(
  {
    caseDetail: state.formattedCaseDetail,
    showFileDocumentForm: state.showFileDocumentForm,
  },
  ({ caseDetail, showFileDocumentForm }) => {
    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back to dashboard
          </a>
        </div>
        <section className="usa-section usa-grid">
          <h1 className="captioned" tabIndex="-1">
            Docket Number: {caseDetail.docketNumberWithSuffix}
          </h1>
          <p>{caseDetail.caseTitle}</p>
          <hr aria-hidden="true" />
          <SuccessNotification />
          <ErrorNotification />
          {showFileDocumentForm && <FileDocument />}
          {!showFileDocumentForm && (
            <Tabs className="classic-horizontal" bind="documentDetail.tab">
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
                <PartyInformation />
              </Tab>
            </Tabs>
          )}
        </section>
      </React.Fragment>
    );
  },
);
