import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';

import { CaseInformationInternal } from './CaseInformationInternal';
import { DocketRecord } from './DocketRecord';
import { ErrorNotification } from './ErrorNotification';
import { PartyInformation } from './PartyInformation';
import { SuccessNotification } from './SuccessNotification';

export const CaseDetail = connect(
  {
    caseDetail: state.formattedCaseDetail,
    currentTab: state.currentTab,
    extractedPendingMessages: state.extractedPendingMessagesFromCaseDetail,
    helper: state.caseDetailHelper,
    submitUpdateCaseSequence: sequences.submitUpdateCaseSequence,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    updateCurrentTabSequence: sequences.updateCurrentTabSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    caseDetail,
    currentTab,
    extractedPendingMessages,
    helper,
    submitUpdateCaseSequence,
    updateCaseValueSequence,
    updateCurrentTabSequence,
    updateFormValueSequence,
  }) => {
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
          <p>
            <span
              className="usa-label case-status-label"
              aria-label={'status: ' + caseDetail.status}
            >
              <span aria-hidden="true">{caseDetail.status}</span>
            </span>
          </p>
          <hr aria-hidden="true" />
          <SuccessNotification />
          <ErrorNotification />

          <div>
            <h2>Pending Messages</h2>
            {extractedPendingMessages.length === 0 && (
              <p>No Pending Messages</p>
            )}
            <table className="row-border-only subsection">
              <tbody>
                {extractedPendingMessages.map((workItem, idx) => (
                  <tr key={idx}>
                    <td className="responsive-title">
                      <p>
                        <span className="label-inline">To</span>
                        {workItem.assigneeName}
                      </p>
                      <p>
                        <span className="label-inline">From</span>
                        {workItem.messages[0].sentBy}
                      </p>
                    </td>
                    <td>
                      <p>
                        <a
                          href={`/case-detail/${
                            workItem.docketNumber
                          }/documents/${workItem.document.documentId}`}
                          className="case-link"
                        >
                          <FontAwesomeIcon icon="file-pdf" />
                          {workItem.document.documentType}
                        </a>
                      </p>
                      <p>{workItem.messages[0].message}</p>
                    </td>
                    <td>
                      <span className="label-inline">Received</span>
                      {workItem.messages[0].createdAtTimeFormatted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
              <li className={currentTab == 'Case Information' ? 'active' : ''}>
                <button
                  role="tab"
                  className="tab-link"
                  aria-selected={currentTab === 'Case Information'}
                  id="case-info-tab"
                  onClick={() =>
                    updateCurrentTabSequence({ value: 'Case Information' })
                  }
                >
                  Case Information
                </button>
              </li>
            </ul>
          </nav>
          {currentTab == 'Docket Record' && (
            <div className="" role="tabpanel">
              <DocketRecord />
            </div>
          )}
          {currentTab == 'Case Information' && (
            <div className="tab-content" role="tabpanel">
              <CaseInformationInternal />
              <PartyInformation />

              <div>
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend>Petition fee</legend>
                  {helper.showPaymentRecord && (
                    <React.Fragment>
                      <p className="label">Paid by pay.gov</p>
                      <p>{caseDetail.payGovId}</p>
                    </React.Fragment>
                  )}
                  {helper.showPaymentOptions && (
                    <ul className="usa-unstyled-list">
                      <li>
                        <input
                          id="paygov"
                          type="radio"
                          name="paymentType"
                          value="payGov"
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                        />
                        <label htmlFor="paygov">Paid by pay.gov</label>
                        {helper.showPayGovIdInput && (
                          <React.Fragment>
                            <label htmlFor="paygovid">Payment ID</label>
                            <input
                              id="paygovid"
                              type="text"
                              name="payGovId"
                              value={caseDetail.payGovId || ''}
                              onChange={e => {
                                updateCaseValueSequence({
                                  key: e.target.name,
                                  value: e.target.value,
                                });
                              }}
                            />
                            <button
                              id="update-case-page-end"
                              onClick={() => submitUpdateCaseSequence()}
                            >
                              Save updates
                            </button>
                          </React.Fragment>
                        )}
                      </li>
                    </ul>
                  )}
                </fieldset>
              </div>
            </div>
          )}
        </section>
      </React.Fragment>
    );
  },
);
