import {
  ASCENDING,
  SORT_ASCENDING_TEXT,
  SORT_DESCENDING_TEXT,
} from '@shared/business/entities/EntityConstants';
import { Button } from '../../ustc-ui/Button/Button';
import { DocketRecordHeader } from './DocketRecordHeader';
import { DocketRecordOverlay } from './DocketRecordOverlay';
import { FilingsAndProceedings } from '../DocketRecord/FilingsAndProceedings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NonPhone, Phone } from '@web-client/ustc-ui/Responsive/Responsive';
import { SealDocketEntryModal } from './SealDocketEntryModal';
import { SortableColumn } from '@web-client/ustc-ui/Table/SortableColumn';
import { UnsealDocketEntryModal } from './UnsealDocketEntryModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
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
    sortTableSequence: sequences.sortTableSequence,
    tableSort: state.tableSort,
    // updateSessionMetadataSequence: sequences.updateSessionMetadataSequence,
  },

  function DocketRecord({
    docketRecordHelper,
    formattedDocketEntriesHelper,
    openSealDocketEntryModalSequence,
    openUnsealDocketEntryModalSequence,
    setSelectedDocumentsForDownloadSequence,
    showModal,
    sortTableSequence,
    tableSort,
    // updateSessionMetadataSequence,
  }) {
    const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

    const noDocumentsMessage = 'There are no documents of that type.';

    useEffect(() => {
      if (!docketRecordHelper.showBatchDownloadControls) return;
      if (!selectAllCheckboxRef.current) return;

      selectAllCheckboxRef.current.indeterminate =
        !!formattedDocketEntriesHelper.someDocumentsSelectedForDownload;
    }, [
      docketRecordHelper.showBatchDownloadControls,
      selectAllCheckboxRef.current,
      formattedDocketEntriesHelper.someDocumentsSelectedForDownload,
    ]);

    return (
      <>
        <DocketRecordHeader />

        <NonPhone>
          <div className="width-full overflow-x-auto">
            <table
              aria-label="docket record"
              className="usa-table ustc-table usa-table--stacked"
              data-testid="docket-record-table"
              id="docket-record-table"
            >
              <thead>
                <tr>
                  {docketRecordHelper.showBatchDownloadControls && (
                    <th>
                      <input
                        aria-label="all-selectable-docket-entries-checkbox"
                        checked={
                          formattedDocketEntriesHelper.allDocumentsSelectedForDownload
                        }
                        data-testid="all-selectable-docket-entries-checkbox"
                        id="all-selectable-docket-entries-checkbox"
                        ref={selectAllCheckboxRef}
                        type="checkbox"
                        onChange={() => {
                          setSelectedDocumentsForDownloadSequence({
                            documentIds:
                              formattedDocketEntriesHelper.allEligibleDocumentsForDownload,
                          });
                        }}
                      />
                    </th>
                  )}
                  <SortableHeader
                    screenReaderTitle="Number"
                    sortField="index"
                    tableSort={tableSort}
                    title="No."
                    onSort={sortTableSequence}
                  />
                  <SortableHeader
                    sortField="sortingFilingDate"
                    sortType="date"
                    tableSort={tableSort}
                    title="Filed Date"
                    onSort={sortTableSequence}
                  />
                  <SortableHeader
                    sortField="eventCode"
                    sortType="string"
                    tableSort={tableSort}
                    title="Event"
                    onSort={sortTableSequence}
                  />
                  <th aria-hidden="true" className="icon-column" />
                  <SortableHeader
                    sortField="descriptionDisplay"
                    sortType="string"
                    tableSort={tableSort}
                    title="Filings and Proceedings"
                    onSort={sortTableSequence}
                  />
                  <SortableHeader
                    className="hide-on-mobile"
                    sortField="numberOfPages"
                    tableSort={tableSort}
                    title="Pages"
                    onSort={sortTableSequence}
                  />
                  <SortableHeader
                    className="hide-on-mobile"
                    sortField="filedBy"
                    sortType="string"
                    tableSort={tableSort}
                    title="Filed By"
                    onSort={sortTableSequence}
                  />
                  <SortableHeader
                    className="hide-on-mobile"
                    sortField="action"
                    sortType=""
                    tableSort={tableSort}
                    title="Action"
                    onSort={sortTableSequence}
                  />
                  <SortableHeader
                    sortField="servedAt"
                    sortType="date"
                    tableSort={tableSort}
                    title="Served"
                    onSort={sortTableSequence}
                  />
                  <SortableHeader
                    className="center-column hide-on-mobile"
                    sortField="servedPartiesCode"
                    sortType="string"
                    tableSort={tableSort}
                    title="Parties"
                    onSort={sortTableSequence}
                  />
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
                        {docketRecordHelper.showBatchDownloadControls && (
                          <td>
                            {entry.isSelectableForDownload && (
                              <input
                                aria-label={`${entry.index}-${entry.documentTitle}`}
                                checked={entry.isDocumentSelected}
                                id={`${entry.index}-${entry.documentTitle}`}
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
                        )}
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
            {!formattedDocketEntriesHelper.formattedDocketEntriesOnDocketRecord
              .length && (
              <p className="margin-bottom-10">{noDocumentsMessage}</p>
            )}
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
          {!formattedDocketEntriesHelper.formattedDocketEntriesOnDocketRecord
            .length && <p className="margin-bottom-10">{noDocumentsMessage}</p>}
        </Phone>

        {showModal == 'DocketRecordOverlay' && <DocketRecordOverlay />}
        {showModal == 'SealDocketEntryModal' && <SealDocketEntryModal />}
        {showModal == 'UnsealDocketEntryModal' && <UnsealDocketEntryModal />}
      </>
    );
  },
);

DocketRecord.displayName = 'DocketRecord';

function SortableHeader({
  className,
  onSort,
  screenReaderTitle,
  sortField,
  sortType,
  tableSort,
  title,
}: {
  className?: string;
  onSort: (sort: { sortField: string; sortOrder: 'asc' | 'desc' }) => void;
  screenReaderTitle?: string;
  sortField: string;
  sortType?: 'string' | 'date';
  tableSort: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
  };
  title: string;
}) {
  return (
    <th>
      <SortableColumn
        ascText={SORT_ASCENDING_TEXT[sortType!]}
        className={className}
        currentlySortedField={tableSort.sortField}
        currentlySortedOrder={tableSort.sortOrder}
        defaultSortOrder={ASCENDING}
        descText={SORT_DESCENDING_TEXT[sortType!]}
        hasRows={true}
        screenReaderTitle={screenReaderTitle}
        sortField={sortField}
        title={title}
        onClickSequence={onSort}
      />
    </th>
  );
}
