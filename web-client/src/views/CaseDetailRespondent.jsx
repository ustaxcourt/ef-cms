import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';

import ErrorNotification from './ErrorNotification';
import FileDocument from './FileDocument';
import PartyInformation from './PartyInformation';
import SuccessNotification from './SuccessNotification';

export default connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    currentTab: state.currentTab,
    helper: state.caseDetailHelper,
    updateCurrentTabSequence: sequences.updateCurrentTabSequence,
  },
  function CaseDetail({
    baseUrl,
    caseDetail,
    currentTab,
    helper,
    updateCurrentTabSequence,
  }) {
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
            Docket number: {caseDetail.docketNumber}
          </h1>
          <p>
            {caseDetail.petitioners[0].name} v. Commissioner of Internal
            Revenue, Respondent
          </p>
          <hr aria-hidden="true" />
          <SuccessNotification />
          <ErrorNotification />
          {currentTab == 'File Document' && <FileDocument />}
          {currentTab != 'File Document' && (
            <nav className="horizontal-tabs">
              <ul role="tabslist">
                <li
                  role="presentation"
                  className={currentTab == 'Docket Record' ? 'active' : ''}
                >
                  <button
                    role="tab"
                    className="tab-link"
                    aria-selected={currentTab === 'Docket Record'}
                    onClick={() =>
                      updateCurrentTabSequence({ value: 'Docket Record' })
                    }
                    id="docket-record-tab"
                  >
                    Docket Record
                  </button>
                </li>
                <li
                  className={currentTab == 'Case Information' ? 'active' : ''}
                >
                  <button
                    role="tab"
                    className="tab-link"
                    id="case-info-tab"
                    aria-selected={currentTab === 'Case Information'}
                    onClick={() =>
                      updateCurrentTabSequence({ value: 'Case Information' })
                    }
                  >
                    Case Information
                  </button>
                </li>
              </ul>
            </nav>
          )}
          {currentTab == 'Docket Record' && (
            <div className="tab-content" role="tabpanel">
              <button
                id="button-file-document"
                className="usa-button"
                onClick={() =>
                  updateCurrentTabSequence({ value: 'File Document' })
                }
              >
                <FontAwesomeIcon icon="cloud-upload-alt" />
                File Document
              </button>
              <table
                className="responsive-table"
                id="docket-record"
                aria-describedby="docket-record-tab"
              >
                <thead>
                  <tr>
                    <th>Date filed</th>
                    <th>Title</th>
                    <th>Filed by</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {caseDetail.documents.map((document, idx) => (
                    <tr key={idx}>
                      <td className="responsive-title">
                        <span className="responsive-label">Activity date</span>
                        {document.createdAtFormatted}
                      </td>
                      <td>
                        <span className="responsive-label">Title</span>
                        <a
                          href={`${baseUrl}/documents/${
                            document.documentId
                          }/documentDownloadUrl`}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`View PDF: ${document.documentType}`}
                        >
                          <FontAwesomeIcon icon="file-pdf" />
                          {document.documentType}
                        </a>
                      </td>
                      <td>
                        <span className="responsive-label">Filed by</span>
                        {document.filedBy}
                      </td>
                      <td>
                        <span className="responsive-label">Status</span>
                        {document.isStatusServed && (
                          <span>{caseDetail.datePetitionSentToIrsMessage}</span>
                        )}
                        {helper.showDocumentStatus && (
                          <span>{document.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {helper.showPaymentRecord && (
                    <tr>
                      <td>{caseDetail.payGovDateFormatted}</td>
                      <td>Filing fee paid</td>
                      <td />
                      <td />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {currentTab == 'Case Information' && (
            <div className="tab-content" role="tabpanel">
              <PartyInformation />
            </div>
          )}
        </section>
      </React.Fragment>
    );
  },
);
