import { Button } from '../../ustc-ui/Button/Button';
import { DocketRecordHeader } from './DocketRecordHeader';
import { DocketRecordOverlay } from './DocketRecordOverlay';
import { FilingsAndProceedings } from '../DocketRecord/FilingsAndProceedings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NonPhone, Phone } from '@web-client/ustc-ui/Responsive/Responsive';
import { SealDocketEntryModal } from './SealDocketEntryModal';
import { UnsealDocketEntryModal } from './UnsealDocketEntryModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect } from 'react';
import classNames from 'classnames';

export const DocketRecord = connect(
  {
    caseDetail: state.caseDetail,
    docketRecordHelper: state.docketRecordHelper,
    formattedDocketEntriesHelper: state.formattedDocketEntries,
    openSealDocketEntryModalSequence:
      sequences.openSealDocketEntryModalSequence,
    openUnsealDocketEntryModalSequence:
      sequences.openUnsealDocketEntryModalSequence,
    setSelectedDocumentsForDownloadSequence:
      sequences.setSelectedDocumentsForDownloadSequence,
    showModal: state.modal.showModal,
  },

  function DocketRecord({
    docketRecordHelper,
    formattedDocketEntriesHelper,
    openSealDocketEntryModalSequence,
    openUnsealDocketEntryModalSequence,
    setSelectedDocumentsForDownloadSequence,
    showModal,
  }) {
    useEffect(() => {
      const documentsSelectorHeaderInput = window.document.getElementById(
        'docket-entry-selections',
      ) as HTMLInputElement;
      if (formattedDocketEntriesHelper.someDocumentsSelectedForDownload) {
        documentsSelectorHeaderInput.indeterminate = true;
      } else documentsSelectorHeaderInput.indeterminate = false;
    }, [formattedDocketEntriesHelper.someDocumentsSelectedForDownload]);

    return (
      <>
        <DocketRecordHeader />

        <NonPhone>
          <div style={{ overflowX: 'scroll', width: '100%' }}>
            <table
              aria-label="docket record"
              className="usa-table ustc-table usa-table--stacked"
              data-testid="docket-record-table"
              id="docket-record-table"
            >
              <thead>
                <tr>
                  <th>
                    <input
                      checked={
                        formattedDocketEntriesHelper.allDocumentsSelectedForDownload
                      }
                      id="docket-entry-selections"
                      type="checkbox"
                      onChange={() => {
                        setSelectedDocumentsForDownloadSequence({
                          documentIds:
                            formattedDocketEntriesHelper.allEligibleDocumentsForDownload,
                        });
                      }}
                    />
                  </th>
                  <th className="center-column hide-on-mobile">
                    <span>
                      <span className="usa-sr-only">Number</span>
                      <span aria-hidden="true">No.</span>
                    </span>
                  </th>
                  <th>Filed Date</th>
                  <th className="center-column hide-on-mobile">Event</th>
                  <th aria-hidden="true" className="icon-column" />
                  <th>Filings and Proceedings</th>
                  <th className="hide-on-mobile">Pages</th>
                  <th className="hide-on-mobile">Filed By</th>
                  <th className="hide-on-mobile">Action</th>
                  <th>Served</th>
                  <th className="center-column hide-on-mobile">Parties</th>
                  {docketRecordHelper.showEditOrSealDocketRecordEntry && (
                    <th>&nbsp;</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {formattedDocketEntriesHelper.formattedDocketEntriesOnDocketRecord.map(
                  entry => {
                    return (
                      <tr
                        className={classNames(
                          entry.isInProgress && 'in-progress',
                          entry.qcWorkItemsUntouched && 'qc-untouched',
                        )}
                        data-testid={entry.docketEntryId}
                        key={entry.docketEntryId}
                      >
                        {' '}
                        <td>
                          {formattedDocketEntriesHelper.isSelectableForDownload(
                            entry,
                          ) && (
                            <input
                              checked={entry.isDocumentSelected}
                              type="checkbox"
                              onChange={() => {
                                const documentIdSelected = {
                                  docketEntryId: entry.docketEntryId,
                                };
                                setSelectedDocumentsForDownloadSequence({
                                  documentIds: [documentIdSelected],
                                });
                              }}
                            />
                          )}
                        </td>
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
                        <td
                          className="center-column hide-on-mobile"
                          data-testid={`docket-entry-index-${entry.index}-eventCode`}
                        >
                          {entry.eventCode}
                        </td>
                        <td aria-hidden="true" className="filing-type-icon">
                          {entry.iconsToDisplay.map(iconInfo => (
                            <FontAwesomeIcon
                              key={iconInfo.icon}
                              {...iconInfo}
                            />
                          ))}
                        </td>
                        <td>
                          <FilingsAndProceedings entry={entry} />
                        </td>
                        <td className="hide-on-mobile number-of-pages">
                          {entry.numberOfPages}
                        </td>
                        <td className="hide-on-mobile">{entry.filedBy}</td>
                        <td className="hide-on-mobile">{entry.action}</td>
                        <td data-testid="docket-record-cell-not-served">
                          {entry.showNotServed && (
                            <span className="text-semibold not-served">
                              Not served
                            </span>
                          )}
                          {entry.showServed && (
                            <span>{entry.servedAtFormatted}</span>
                          )}
                        </td>
                        <td
                          className="center-column hide-on-mobile"
                          data-testid={`docket-entry-index-${entry.index}-servedPartiesCode`}
                        >
                          {entry.showServed && entry.servedPartiesCode}
                        </td>
                        {docketRecordHelper.showEditOrSealDocketRecordEntry && (
                          <td className="seal-and-edit-col">
                            {entry.showEditDocketRecordEntry && (
                              <Button
                                link
                                data-testid={`edit-${entry.eventCode}`}
                                href={entry.editDocketEntryMetaLink}
                                icon="edit"
                              >
                                Edit
                              </Button>
                            )}
                            {entry.showSealDocketRecordEntry && (
                              <Button
                                link
                                className={entry.isSealed && 'red-warning'}
                                data-testid={`seal-docket-entry-button-${entry.index}`}
                                icon={entry.sealIcon}
                                tooltip={entry.sealButtonTooltip}
                                onClick={() => {
                                  entry.isSealed
                                    ? openUnsealDocketEntryModalSequence({
                                        docketEntryId: entry.docketEntryId,
                                        showModal: 'UnsealDocketEntryModal',
                                      })
                                    : openSealDocketEntryModalSequence({
                                        docketEntryId: entry.docketEntryId,
                                        showModal: 'SealDocketEntryModal',
                                      });
                                }}
                              >
                                {entry.sealButtonText}
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
          </div>
        </NonPhone>

        <Phone>
          <table className="usa-table usa-table--stacked-header usa-table--borderless">
            <thead>
              <tr>
                <th scope="col">Filed Date</th>
                <th scope="col">Filings and Proceedings</th>
                <th scope="col">Served</th>
              </tr>
            </thead>
            <tbody>
              {formattedDocketEntriesHelper.formattedDocketEntriesOnDocketRecord.map(
                entry => {
                  return (
                    <tr key={entry.index}>
                      <td data-label="No.">{entry.index}</td>
                      <td data-label="Filed Date">
                        {entry.createdAtFormatted}
                      </td>
                      <td data-label="Filings and Proceedings">
                        <FilingsAndProceedings entry={entry} />
                      </td>
                      <td data-label="Served">
                        {entry.showNotServed && (
                          <span className="text-secondary text-semibold">
                            Not served
                          </span>
                        )}
                        {entry.showServed && (
                          <span>{entry.servedAtFormatted}</span>
                        )}
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </Phone>

        {showModal == 'DocketRecordOverlay' && <DocketRecordOverlay />}
        {showModal == 'SealDocketEntryModal' && <SealDocketEntryModal />}
        {showModal == 'UnsealDocketEntryModal' && <UnsealDocketEntryModal />}
      </>
    );
  },
);

DocketRecord.displayName = 'DocketRecord';
