import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';

import ErrorNotification from './ErrorNotification';
import FileDocument from './FileDocument';
import openDocumentBlob from './openDocumentBlob';
import SuccessNotification from './SuccessNotification';

export default connect(
  {
    caseDetail: state.formattedCaseDetail,
    currentTab: state.currentTab,
    updateCurrentTab: sequences.updateCurrentTab,
    viewDocument: sequences.viewDocument,
  },
  function CaseDetail({
    caseDetail,
    currentTab,
    updateCurrentTab,
    viewDocument,
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
          <h1 tabIndex="-1">Docket number: {caseDetail.docketNumber}</h1>
          <p>
            {caseDetail.userId} v. Commissioner of Internal Revenue, Respondent
          </p>
          <hr />
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
                    onClick={() => updateCurrentTab({ value: 'Docket Record' })}
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
                    onClick={() =>
                      updateCurrentTab({ value: 'Case Information' })
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
                onClick={() => updateCurrentTab({ value: 'File Document' })}
              >
                <FontAwesomeIcon icon="cloud-upload-alt" /> File Document
              </button>
              <table className="responsive-table">
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
                        <button
                          className="pdf-link"
                          aria-label="View PDF"
                          onClick={() =>
                            viewDocument({
                              documentId: document.documentId,
                              callback: openDocumentBlob,
                            })
                          }
                        >
                          <FontAwesomeIcon icon="file-pdf" />
                          {document.documentType}
                        </button>
                      </td>
                      <td>
                        <span className="responsive-label">Filed by</span>
                        {document.userId}
                      </td>
                      <td>
                        <span className="responsive-label">Status</span>
                        {caseDetail.showIrsServedDate && (
                          <span>{caseDetail.datePetitionSentToIrsMessage}</span>
                        )}
                        {caseDetail.showDocumentStatus && (
                          <span>{document.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {caseDetail.showPaymentRecord && (
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
            <div className="tab-content" role="tabpanel" />
          )}
        </section>
      </React.Fragment>
    );
  },
);
