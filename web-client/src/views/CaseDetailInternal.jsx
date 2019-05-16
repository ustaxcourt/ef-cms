import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseInformationInternal } from './CaseDetail/CaseInformationInternal';
import { DocketRecord } from './DocketRecord/DocketRecord';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PartyInformation } from './CaseDetail/PartyInformation';
import { SuccessNotification } from './SuccessNotification';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseDetailInternal = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    documentHelper: state.documentHelper,
    extractedPendingMessages: state.extractedPendingMessagesFromCaseDetail,
    token: state.token,
  },
  ({
    baseUrl,
    caseDetail,
    documentHelper,
    extractedPendingMessages,
    token,
  }) => {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div>
            <div className="title margin-bottom-5">
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
            <Tab tabName="caseInfo" title="Case Information" id="tab-case-info">
              <CaseInformationInternal />
              <PartyInformation />
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
