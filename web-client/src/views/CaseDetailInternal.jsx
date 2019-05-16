import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseInformationInternal } from './CaseDetail/CaseInformationInternal';
import { DocketRecord } from './DocketRecord/DocketRecord';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div>
            <div className="title">
              <h1>Messages In Progress</h1>
            </div>

            {extractedPendingMessages.length === 0 && (
              <p>No Messages In Progress</p>
            )}
            <table className="usa-table row-border-only subsection messages">
              <thead>
                <tr>
                  <th className="header-fixed-width">To</th>
                  <th className="header-fixed-width">From</th>
                  <th className="header-fixed-width">Received</th>
                  <th>Message</th>
                </tr>
              </thead>

              <tbody>
                {extractedPendingMessages.map((workItem, idx) => (
                  <tr key={idx}>
                    <td className="responsive-title padding-extra">
                      {workItem.assigneeName}
                    </td>
                    <td className="padding-extra">
                      {workItem.messages[0].from}
                    </td>
                    <td className="padding-extra">
                      {workItem.messages[0].createdAtTimeFormatted}
                    </td>
                    <td className="padding-extra">
                      <p className="margin-y-0">
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
                      <p className="message-detail margin-y-0">
                        {workItem.messages[0].message}
                      </p>
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
                        <label htmlFor="paygov" className="usa-label">
                          Paid by pay.gov
                        </label>
                        {caseHelper.showPayGovIdInput && (
                          <>
                            <label htmlFor="paygovid" className="usa-label">
                              Payment ID
                            </label>
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
                          </>
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
      </>
    );
  },
);
