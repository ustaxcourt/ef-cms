import { DocketRecordHeader } from './DocketRecordHeader';
import { DocketRecordOverlay } from './DocketRecordOverlay';
import { FilingsAndProceedings } from './FilingsAndProceedings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';
import classNames from 'classnames';

export const DocketRecord = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    clearDocumentSequence: sequences.clearDocumentSequence,
    docketRecordHelper: state.docketRecordHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    refreshCaseSequence: sequences.refreshCaseSequence,
    showModal: state.showModal,
  },
  ({
    caseDetailHelper,
    docketRecordHelper,
    formattedCaseDetail,
    refreshCaseSequence,
    showModal,
  }) => {
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
              <th className="center-column">
                <span>
                  <span className="usa-sr-only">Number</span>
                  <span aria-hidden="true">No.</span>
                </span>
              </th>
              <th>Date</th>
              <th className="center-column">Event</th>
              <th aria-hidden="true" className="icon-column" />
              <th>Filings and proceedings</th>
              <th>Filed by</th>
              <th>Action</th>
              <th>Served</th>
              <th className="center-column">Parties</th>
            </tr>
          </thead>
          <tbody>
            {formattedCaseDetail.docketRecordWithDocument.map(
              ({ document, index, record }, arrayIndex) => {
                const isInProgress =
                  caseDetailHelper.showDocketRecordInProgressState &&
                  document &&
                  document.isInProgress;

                const qcWorkItemsUntouched =
                  !isInProgress &&
                  caseDetailHelper.showQcWorkItemsUntouchedState &&
                  document &&
                  document.qcWorkItemsUntouched;
                return (
                  <tr
                    className={classNames(
                      document &&
                        document.isInProgress &&
                        caseDetailHelper.showDocketRecordInProgressState &&
                        'in-progress',
                      qcWorkItemsUntouched && 'qc-untouched',
                    )}
                    key={index}
                  >
                    <td className="center-column hide-on-mobile">{index}</td>
                    <td>
                      <span className="no-wrap">
                        {record.createdAtFormatted}
                      </span>
                    </td>
                    <td className="center-column hide-on-mobile">
                      {record.eventCode || (document && document.eventCode)}
                    </td>
                    <td
                      aria-hidden="true"
                      className="filing-type-icon hide-on-mobile"
                    >
                      {document && document.isPaper && !isInProgress && (
                        <FontAwesomeIcon icon={['fas', 'file-alt']} />
                      )}

                      {isInProgress && (
                        <FontAwesomeIcon icon={['fas', 'thumbtack']} />
                      )}

                      {qcWorkItemsUntouched && (
                        <FontAwesomeIcon icon={['fa', 'star']} />
                      )}

                      {document &&
                        docketRecordHelper.showDirectDownloadLink &&
                        caseDetailHelper.showDocketRecordInProgressState &&
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
                        <span>{document.servedAtFormatted}</span>
                      )}
                    </td>
                    <td className="center-column hide-on-mobile">
                      <span className="responsive-label">Parties</span>
                      {document && document.servedPartiesCode}
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
        {showModal == 'DocketRecordOverlay' && <DocketRecordOverlay />}
      </React.Fragment>
    );
  },
);
