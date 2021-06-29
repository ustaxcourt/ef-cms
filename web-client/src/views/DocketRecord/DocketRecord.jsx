import { Button } from '../../ustc-ui/Button/Button';
import { DocketRecordHeader } from './DocketRecordHeader';
import { DocketRecordOverlay } from './DocketRecordOverlay';
import { FilingsAndProceedings } from '../DocketRecord/FilingsAndProceedings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const DocketRecord = connect(
  {
    docketRecordHelper: state.docketRecordHelper,
    formattedDocketEntries: state.formattedDocketEntries,
    showModal: state.modal.showModal,
  },

  function DocketRecord({
    docketRecordHelper,
    formattedDocketEntries,
    showModal,
  }) {
    const getIcon = entry => {
      if (entry.isLegacySealed) {
        return (
          <FontAwesomeIcon
            className="sealed-address"
            icon={['fas', 'lock']}
            title="is legacy sealed"
          />
        );
      }

      // we only care to show the lock icon for external users,
      // so we check if hideIcons is true AFTER we renter the lock icon
      if (entry.hideIcons) return;

      if (entry.isPaper) {
        return <FontAwesomeIcon icon={['fas', 'file-alt']} title="is paper" />;
      }

      if (entry.isInProgress) {
        return (
          <FontAwesomeIcon icon={['fas', 'thumbtack']} title="in progress" />
        );
      }

      if (entry.qcNeeded) {
        return <FontAwesomeIcon icon={['fa', 'star']} title="is untouched" />;
      }

      if (entry.showLoadingIcon) {
        return (
          <FontAwesomeIcon
            className="fa-spin spinner"
            icon="spinner"
            title="is loading"
          />
        );
      }
    };

    return (
      <>
        <DocketRecordHeader />
        <table
          aria-label="docket record"
          className="usa-table case-detail ustc-table responsive-table"
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
            {formattedDocketEntries.formattedDocketEntriesOnDocketRecord.map(
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
                    <td aria-hidden="true" className="filing-type-icon">
                      {getIcon(entry)}
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
                    <td className="hide-on-mobile">
                      {entry.showNotServed && (
                        <span className="text-semibold not-served">
                          Not served
                        </span>
                      )}
                      {entry.showServed && (
                        <span>{entry.servedAtFormatted}</span>
                      )}
                    </td>
                    <td className="center-column hide-on-mobile">
                      <span className="responsive-label">Parties</span>
                      {entry.showServed && entry.servedPartiesCode}
                    </td>
                    {docketRecordHelper.showEditDocketRecordEntry && (
                      <td>
                        {entry.showEditDocketRecordEntry && (
                          <Button
                            link
                            href={entry.editDocketEntryMetaLink}
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
