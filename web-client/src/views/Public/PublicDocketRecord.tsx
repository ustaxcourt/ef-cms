import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { KEYS } from '@shared/business/entities/EntityConstants';
import { NonPhone, Phone } from '@web-client/ustc-ui/Responsive/Responsive';
import { PublicDocketRecordHeader } from './PublicDocketRecordHeader';
import { PublicFilingsAndProceedings } from './PublicFilingsAndProceedings';
import { SortableHeader } from '@web-client/views/DocketRecord/DocketRecord';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';
import classNames from 'classnames';

export const PublicDocketRecord = connect(
  {
    docketNumber: state.caseDetail.docketNumber,
    publicCaseDetailHelper: state.publicCaseDetailHelper,
    sortTableSequence: sequences.sortTableSequence,
    tableSort: state[KEYS.DOCKET_RECORD_TABLE_SORT],
  },
  function ({ publicCaseDetailHelper, sortTableSequence, tableSort }) {
    const noDocumentsMessage = 'There are no documents of that type.';
    return (
      <>
        <PublicDocketRecordHeader />

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
                    tableSort={tableSort}
                    title="No."
                    onSort={sortTableInfo =>
                      sortTableSequence({
                        ...sortTableInfo,
                        root: KEYS.DOCKET_RECORD_TABLE_SORT,
                      })
                    }
                  />
                  <SortableHeader
                    sortField="sortingFilingDate"
                    sortType="date"
                    tableSort={tableSort}
                    title="Filed Date"
                    onSort={sortTableInfo =>
                      sortTableSequence({
                        ...sortTableInfo,
                        root: KEYS.DOCKET_RECORD_TABLE_SORT,
                      })
                    }
                  />
                  <SortableHeader
                    hideOnMobile={true}
                    sortField="eventCode"
                    sortType="string"
                    tableSort={tableSort}
                    title="Event"
                    onSort={sortTableInfo =>
                      sortTableSequence({
                        ...sortTableInfo,
                        root: KEYS.DOCKET_RECORD_TABLE_SORT,
                      })
                    }
                  />
                  <th aria-hidden="true" className="icon-column" />
                  <SortableHeader
                    sortField="descriptionDisplay"
                    sortType="string"
                    tableSort={tableSort}
                    title="Filings and Proceedings"
                    onSort={sortTableInfo =>
                      sortTableSequence({
                        ...sortTableInfo,
                        root: KEYS.DOCKET_RECORD_TABLE_SORT,
                      })
                    }
                  />
                  <SortableHeader
                    className="hide-on-mobile"
                    hideOnMobile={true}
                    sortField="numberOfPages"
                    tableSort={tableSort}
                    title="Pages"
                    onSort={sortTableInfo =>
                      sortTableSequence({
                        ...sortTableInfo,
                        root: KEYS.DOCKET_RECORD_TABLE_SORT,
                      })
                    }
                  />
                  <SortableHeader
                    className="hide-on-mobile"
                    hideOnMobile={true}
                    sortField="filedBy"
                    sortType="string"
                    tableSort={tableSort}
                    title="Filed By"
                    onSort={sortTableInfo =>
                      sortTableSequence({
                        ...sortTableInfo,
                        root: KEYS.DOCKET_RECORD_TABLE_SORT,
                      })
                    }
                  />
                  <SortableHeader
                    className="hide-on-mobile"
                    hideOnMobile={true}
                    sortField="action"
                    sortType="string"
                    tableSort={tableSort}
                    title="Action"
                    onSort={sortTableInfo =>
                      sortTableSequence({
                        ...sortTableInfo,
                        root: KEYS.DOCKET_RECORD_TABLE_SORT,
                      })
                    }
                  />
                  <SortableHeader
                    sortField="servedAt"
                    sortType="date"
                    tableSort={tableSort}
                    title="Served"
                    onSort={sortTableInfo =>
                      sortTableSequence({
                        ...sortTableInfo,
                        root: KEYS.DOCKET_RECORD_TABLE_SORT,
                      })
                    }
                  />
                  <SortableHeader
                    className="center-column hide-on-mobile"
                    hideOnMobile={true}
                    sortField="servedPartiesCode"
                    sortType="string"
                    tableSort={tableSort}
                    title="Parties"
                    onSort={sortTableInfo =>
                      sortTableSequence({
                        ...sortTableInfo,
                        root: KEYS.DOCKET_RECORD_TABLE_SORT,
                      })
                    }
                  />
                </tr>
              </thead>
              <tbody>
                {publicCaseDetailHelper.formattedDocketEntriesOnDocketRecord.map(
                  entry => {
                    return (
                      <tr key={entry.index}>
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
