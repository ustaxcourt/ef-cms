import { Button } from '../../ustc-ui/Button/Button';
import { DocketRecordHeader } from './DocketRecordHeader';
import { DocketRecordOverlay } from './DocketRecordOverlay';
import { FilingsAndProceedings } from './FilingsAndProceedings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const DocketRecord = connect(
  {
    docketRecordHelper: state.docketRecordHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    showModal: state.modal.showModal,
  },
  function DocketRecord({
    docketRecordHelper,
    formattedCaseDetail,
    showModal,
  }) {
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
              <th>Filings and Proceedings</th>
              <th>Pages</th>
              <th>Filed By</th>
              <th>Action</th>
              <th>Served</th>
              <th className="center-column">Parties</th>
              {docketRecordHelper.showEditDocketRecordEntry && <th>&nbsp;</th>}
            </tr>
          </thead>
          <tbody>
            {formattedCaseDetail.formattedDocketEntries.map(
              (entry, arrayIndex) => {
                return (
                  <tr
                    className={classNames(
                      entry.isInProgress && 'in-progress',
                      entry.qcWorkItemsUntouched && 'qc-untouched',
                    )}
                    key={entry.index}
                  >
                    <td className="center-column hide-on-mobile">
                      {entry.index}
                    </td>
                    <td>
                      <span
                        className={classNames(
                          entry.isStricken && 'stricken-docket-record',
                          'no-wrap',
                        )}
                      >
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

                      {entry.isInProgress && (
                        <FontAwesomeIcon icon={['fas', 'thumbtack']} />
                      )}

                      {entry.qcWorkItemsUntouched && (
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
                    <td className="hide-on-mobile number-of-pages">
                      {entry.numberOfPages}
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
                    {docketRecordHelper.showEditDocketRecordEntry && (
                      <td>
                        {entry.showEditDocketRecordEntry && (
                          <Button
                            link
                            href={`/case-detail/${formattedCaseDetail.docketNumber}/docket-entry/${entry.index}/edit-meta`}
                            icon="edit"
                          >
                            Edit
                          </Button>
                        )}
                      </td>
                    )}
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
