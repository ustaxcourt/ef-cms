import { Button } from '../../ustc-ui/Button/Button';
import { DocketRecordHeader } from './DocketRecordHeader';
import { DocketRecordOverlay } from './DocketRecordOverlay';
import { FilingsAndProceedings } from '../DocketRecord/FilingsAndProceedings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SealDocketEntryModal } from './SealDocketEntryModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const DocketRecord = connect(
  {
    docketRecordHelper: state.docketRecordHelper,
    formattedDocketEntries: state.formattedDocketEntries,
    openSealDocketEntryModalSequence:
      sequences.openSealDocketEntryModalSequence,
    showModal: state.modal.showModal,
  },

  function DocketRecord({
    docketRecordHelper,
    formattedDocketEntries,
    openSealDocketEntryModalSequence,
    showModal,
  }) {
    const getIcon = entry => {
      let icons = [];
      if (entry.sealedTo) {
        icons.push(
          <FontAwesomeIcon
            className="sealed-docket-entry"
            icon="lock"
            title={entry.sealedToTooltip}
          />,
        );
      }
      if (entry.isLegacySealed) {
        icons.push(
          <FontAwesomeIcon
            className="sealed-address"
            icon={['fas', 'lock']}
            title="is legacy sealed"
          />,
        );
        return icons;
      }

      // we only care to show the lock icon for external users,
      // so we check if hideIcons is true AFTER we renter the lock icon
      if (entry.hideIcons) return [];

      if (entry.isPaper) {
        icons.push(
          <FontAwesomeIcon icon={['fas', 'file-alt']} title="is paper" />,
        );
        return icons;
      }

      if (entry.isInProgress) {
        icons.push(
          <FontAwesomeIcon icon={['fas', 'thumbtack']} title="in progress" />,
        );
        return icons;
      }

      if (entry.qcNeeded) {
        icons.push(
          <FontAwesomeIcon icon={['fa', 'star']} title="is untouched" />,
        );
        return icons;
      }

      if (entry.showLoadingIcon) {
        icons.push(
          <FontAwesomeIcon
            className="fa-spin spinner"
            icon="spinner"
            title="is loading"
          />,
        );
        return icons;
      }

      return icons;
    };

    return (
      <>
        <DocketRecordHeader />
        <table
          aria-label="docket record"
          className="usa-table case-detail ustc-table responsive-table"
          id="docket-record-table"
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
              {docketRecordHelper.showEditOrSealDocketRecordEntry && (
                <th>&nbsp;</th>
              )}
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
                    key={entry.docketEntryId}
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
                    {docketRecordHelper.showEditOrSealDocketRecordEntry && (
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
                        {entry.showSealDocketRecordEntry && (
                          <Button
                            link
                            icon="lock"
                            onClick={() => {
                              openSealDocketEntryModalSequence({
                                docketEntryId: entry.docketEntryId,
                                showModal: 'SealDocketEntryModal',
                              });
                            }}
                          >
                            Seal
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
        {showModal == 'SealDocketEntryModal' && <SealDocketEntryModal />}
      </>
    );
  },
);
