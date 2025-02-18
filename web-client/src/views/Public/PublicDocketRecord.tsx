import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NonPhone, Phone } from '@web-client/ustc-ui/Responsive/Responsive';
import { PublicDocketRecordHeader } from './PublicDocketRecordHeader';
import { PublicFilingsAndProceedings } from './PublicFilingsAndProceedings';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';
import classNames from 'classnames';
import { SortableHeader } from '@web-client/ustc-ui/Table/SortableHeader';

export const PublicDocketRecord = connect(
  {
    docketNumber: state.caseDetail.docketNumber,
    docketRecordTableSortData: state[STATE_KEYS.DOCKET_RECORD_TABLE_SORT],
    publicCaseDetailHelper: state.publicCaseDetailHelper,
    sortTableSequence: sequences.sortTableSequence,
  },
  function ({
    docketRecordTableSortData,
    publicCaseDetailHelper,
    sortTableSequence,
  }) {
    const noDocumentsMessage = 'There are no documents of that type.';
    return (
      <>
        <PublicDocketRecordHeader
          docketRecordTableSortData={docketRecordTableSortData}
        />

        <NonPhone>
          <div className="width-full overflow-x-auto">
            <table
              aria-label="docket record"
              className="usa-table ustc-table usa-table--stacked"
              data-testid="table-public-docket-record"
              id="docket-record-table"
            >
              <thead>
                <tr>
                  <SortableHeader
                    hideOnMobile={true}
                    screenReaderTitle="Number"
                    sortField="index"
                    tableSort={docketRecordTableSortData}
                    title="No."
                    onSort={sortTableSequence}
                    stateKey={STATE_KEYS.DOCKET_RECORD_TABLE_SORT}
                  />
                  <SortableHeader
                    sortField="sortingFilingDate"
                    sortType="date"
                    tableSort={docketRecordTableSortData}
                    title="Filed Date"
                    onSort={sortTableSequence}
                    stateKey={STATE_KEYS.DOCKET_RECORD_TABLE_SORT}
                  />
                  <SortableHeader
                    hideOnMobile={true}
                    sortField="eventCode"
                    sortType="string"
                    tableSort={docketRecordTableSortData}
                    title="Event"
                    onSort={sortTableSequence}
                    stateKey={STATE_KEYS.DOCKET_RECORD_TABLE_SORT}
                  />
                  <th aria-hidden="true" className="icon-column" />
                  <SortableHeader
                    sortField="descriptionDisplay"
                    sortType="string"
                    tableSort={docketRecordTableSortData}
                    title="Filings and Proceedings"
                    onSort={sortTableSequence}
                    stateKey={STATE_KEYS.DOCKET_RECORD_TABLE_SORT}
                  />
                  <SortableHeader
                    className="hide-on-mobile"
                    hideOnMobile={true}
                    sortField="numberOfPages"
                    tableSort={docketRecordTableSortData}
                    title="Pages"
                    onSort={sortTableSequence}
                    stateKey={STATE_KEYS.DOCKET_RECORD_TABLE_SORT}
                  />
                  <SortableHeader
                    className="hide-on-mobile"
                    hideOnMobile={true}
                    sortField="filedBy"
                    sortType="string"
                    tableSort={docketRecordTableSortData}
                    title="Filed By"
                    onSort={sortTableSequence}
                    stateKey={STATE_KEYS.DOCKET_RECORD_TABLE_SORT}
                  />
                  <SortableHeader
                    className="hide-on-mobile"
                    hideOnMobile={true}
                    sortField="action"
                    sortType="string"
                    tableSort={docketRecordTableSortData}
                    title="Action"
                    onSort={sortTableSequence}
                    stateKey={STATE_KEYS.DOCKET_RECORD_TABLE_SORT}
                  />
                  <SortableHeader
                    sortField="servedAt"
                    sortType="date"
                    tableSort={docketRecordTableSortData}
                    title="Served"
                    onSort={sortTableSequence}
                    stateKey={STATE_KEYS.DOCKET_RECORD_TABLE_SORT}
                  />
                  <SortableHeader
                    className="center-column hide-on-mobile"
                    hideOnMobile={true}
                    sortField="servedPartiesCode"
                    sortType="string"
                    tableSort={docketRecordTableSortData}
                    title="Parties"
                    onSort={sortTableSequence}
                    stateKey={STATE_KEYS.DOCKET_RECORD_TABLE_SORT}
                  />
                </tr>
              </thead>
              <tbody>
                {publicCaseDetailHelper.formattedDocketEntriesOnDocketRecord.map(
                  entry => {
                    return (
                      <tr
                        data-testid={`public-docket-record-no-${entry.index}`}
                        key={entry.index}
                      >
                        <td className="center-column hide-on-mobile">
                          {entry.index}
                        </td>
                        <td data-label="Filed Date">
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
                          {entry.isSealed && (
                            <FontAwesomeIcon
                              className="sealed-in-blackstone icon-sealed"
                              icon="lock"
                              size="1x"
                              title={entry.sealedToTooltip}
                            />
                          )}
                        </td>
                        <td data-label="Filings and Proceedings">
                          <PublicFilingsAndProceedings entry={entry} />
                        </td>
                        <td className="hide-on-mobile">
                          {entry.numberOfPages}
                        </td>
                        <td className="hide-on-mobile">{entry.filedBy}</td>
                        <td className="hide-on-mobile">{entry.action}</td>
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
                        <td className="center-column hide-on-mobile">
                          {entry.servedPartiesCode}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
            {!publicCaseDetailHelper.formattedDocketEntriesOnDocketRecord
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
              {publicCaseDetailHelper.formattedDocketEntriesOnDocketRecord.map(
                entry => {
                  return (
                    <tr key={entry.index}>
                      <td data-label="No.">{entry.index}</td>
                      <td data-label="Filed Date">
                        {entry.createdAtFormatted}
                      </td>
                      <td data-label="Filings and Proceedings">
                        <PublicFilingsAndProceedings entry={entry} />
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
          {!publicCaseDetailHelper.formattedDocketEntriesOnDocketRecord
            .length && <p className="margin-bottom-10">{noDocumentsMessage}</p>}
        </Phone>
      </>
    );
  },
);

PublicDocketRecord.displayName = 'PublicDocketRecord';
