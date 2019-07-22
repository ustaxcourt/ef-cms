import { DocketRecordHeader } from './DocketRecordHeader';
import { DocketRecordOverlay } from './DocketRecordOverlay';
import { FilingsAndProceedings } from './FilingsAndProceedings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const DocketRecord = connect(
  {
    caseDetail: state.formattedCaseDetail,
    clearDocumentSequence: sequences.clearDocumentSequence,
    helper: state.caseDetailHelper,
    refreshCaseSequence: sequences.refreshCaseSequence,
    showModal: state.showModal,
  },
  ({ caseDetail, helper, refreshCaseSequence, showModal }) => {
    useEffect(() => {
      const interval = setInterval(() => {
        refreshCaseSequence();
      }, 30 * 1000);

      return () => {
        clearInterval(interval);
      };
    }, []);

    return (
      <React.Fragment>
        <DocketRecordHeader />

        <table
          aria-label="docket record"
          className="usa-table case-detail docket-record responsive-table row-border-only"
        >
          <thead>
            <tr>
              <th aria-label="Number" className="center-column">
                No.
              </th>
              <th>Date</th>
              <th className="center-column">Event</th>
              <th aria-hidden="true" className="icon-column" />
              <th>Filings and Proceedings</th>
              <th>Filed By</th>
              <th>Action</th>
              <th>Served</th>
              <th className="center-column">Parties</th>
            </tr>
          </thead>
          <tbody>
            {caseDetail.docketRecordWithDocument.map(
              ({ document, index, record }, arrayIndex) => (
                <tr key={index}>
                  <td className="center-column hide-on-mobile">{index}</td>
                  <td>
                    <span className="no-wrap">{record.createdAtFormatted}</span>
                  </td>
                  <td className="center-column hide-on-mobile">
                    {document && document.eventCode}
                  </td>
                  <td
                    aria-hidden="true"
                    className="filing-type-icon hide-on-mobile"
                  >
                    {document && document.isPaper && (
                      <FontAwesomeIcon icon={['fas', 'file-alt']} />
                    )}
                    {document &&
                      helper.showDirectDownloadLink &&
                      document.processingStatus !== 'complete' && (
                        <FontAwesomeIcon
                          className="fa-spin spinner"
                          icon="spinner"
                        />
                      )}
                  </td>
                  <td>
                    <FilingsAndProceedings
                      arrayIndex={arrayIndex}
                      document={document}
                      record={record}
                    />
                  </td>
                  <td className="hide-on-mobile">
                    {document && document.filedBy}
                  </td>
                  <td className="hide-on-mobile">{record.action}</td>
                  <td>
                    {document && document.isStatusServed && (
                      <span>
                        {document.servedAtFormatted ||
                          caseDetail.datePetitionSentToIrsMessage}
                      </span>
                    )}
                  </td>
                  <td className="center-column hide-on-mobile">
                    <span className="responsive-label">Parties</span>
                    {document && document.servedPartiesCode}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        {showModal == 'DocketRecordOverlay' && <DocketRecordOverlay />}
      </React.Fragment>
    );
  },
);
