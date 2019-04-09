import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseInformationInternal } from './CaseInformationInternal';
import { DocketRecord } from './DocketRecord';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PartyInformation } from './PartyInformation';
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
    documentHelper: state.documentHelper,
    extractedPendingMessages: state.extractedPendingMessagesFromCaseDetail,
    submitUpdateCaseSequence: sequences.submitUpdateCaseSequence,
    token: state.token,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    baseUrl,
    caseDetail,
    caseHelper,
    documentHelper,
    extractedPendingMessages,
    submitUpdateCaseSequence,
    token,
    updateCaseValueSequence,
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
          <CaseDetailHeader />
          <hr aria-hidden="true" />
          <SuccessNotification />
          <ErrorNotification />

          <div>
            <h2>Messages In Progress</h2>
            {extractedPendingMessages.length === 0 && (
              <p>No Messages In Progress</p>
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
                        {workItem.messages[0].from}
                      </p>
                    </td>
                    <td>
                      <p>
                        <a
                          href={documentHelper({
                            docketNumber: workItem.docketNumber,
                            documentId: workItem.document.documentId,
                          })}
                          className="case-link"
                        >
                          <FontAwesomeIcon icon={['far', 'file-pdf']} />
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

          <Tabs className="classic-horizontal" bind="documentDetail.tab">
            <Tab
              tabName="docketRecord"
              title="Docket Record"
              id="tab-docket-record"
            >
              <DocketRecord />
            </Tab>
            <Tab tabName="caseInfo" title="Case Information" id="tab-case-info">
              <CaseInformationInternal />
              <PartyInformation />

              <div>
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend>Petition fee</legend>
                  {caseHelper.showPaymentRecord && (
                    <React.Fragment>
                      <p className="label">Paid by pay.gov</p>
                      <p>{caseDetail.payGovId}</p>
                    </React.Fragment>
                  )}
                  {caseHelper.showPaymentOptions && (
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
                        {caseHelper.showPayGovIdInput && (
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
            </Tab>
          </Tabs>
        </section>
        {/* This section below will be removed in a future story */}
        <section>
          {caseDetail.status === 'General Docket' && (
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
        </section>
      </React.Fragment>
    );
  },
);
