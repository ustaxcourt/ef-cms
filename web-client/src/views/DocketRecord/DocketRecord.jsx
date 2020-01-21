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
    formattedCaseDetail: state.formattedCaseDetail,
    refreshCaseSequence: sequences.refreshCaseSequence,
    showModal: state.showModal,
  },
  ({ formattedCaseDetail, refreshCaseSequence, showModal }) => {
    useEffect(() => {
      const interval = setInterval(() => {
        refreshCaseSequence();
      }, 30 * 1000);

      return () => {
        clearInterval(interval);
      };
    }, []);

    return (
      <>
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
            {formattedCaseDetail.formattedDocketEntries.map(
              (entry, arrayIndex) => {
                return (
                  <tr
                    className={classNames(
                      entry.showInProgress && 'in-progress',
                      entry.showQcUntouched && 'qc-untouched',
                    )}
                    key={entry.index}
                  >
                    <td className="center-column hide-on-mobile">
                      {entry.index}
                    </td>
                    <td>
                      <span className="no-wrap">
                        {entry.createdAtFormatted}
                      </span>
                    </td>
                    <td className="center-column hide-on-mobile">
                      {entry.eventCode}
                    </td>
                    <td
                      aria-hidden="true"
                      className="filing-type-icon hide-on-mobile"
                    >
                      {entry.isPaper && (
                        <FontAwesomeIcon icon={['fas', 'file-alt']} />
                      )}

                      {entry.showInProgress && (
                        <FontAwesomeIcon icon={['fas', 'thumbtack']} />
                      )}

                      {entry.showQcUntouched && (
                        <FontAwesomeIcon icon={['fa', 'star']} />
                      )}

                      {entry.showLoadingIcon && (
                        <FontAwesomeIcon
                          className="fa-spin spinner"
                          icon="spinner"
                        />
                      )}
                    </td>
                    <td>
                      <FilingsAndProceedings
                        arrayIndex={arrayIndex}
                        entry={entry}
                      />
                    </td>
                    <td className="hide-on-mobile">{entry.filedBy}</td>
                    <td className="hide-on-mobile">{entry.action}</td>
                    <td>
                      {entry.showNotServed && (
                        <span className="text-secondary text-semibold">
                          Not served
                        </span>
                      )}
                      {entry.showServed && (
                        <span>{entry.servedAtFormatted}</span>
                      )}
                    </td>
                    <td className="center-column hide-on-mobile">
                      <span className="responsive-label">Parties</span>
                      {entry.servedPartiesCode}
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
        {showModal == 'DocketRecordOverlay' && <DocketRecordOverlay />}
      </>
    );
  },
);
