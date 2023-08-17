import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PublicDocketRecordHeader } from './PublicDocketRecordHeader';
import { PublicFilingsAndProceedings } from './PublicFilingsAndProceedings';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';
import classNames from 'classnames';

export const PublicDocketRecord = connect(
  {
    docketNumber: state.caseDetail.docketNumber,
    publicCaseDetailHelper: state.publicCaseDetailHelper,
  },
  function ({ publicCaseDetailHelper }) {
    return (
      <>
        <PublicDocketRecordHeader />

        <table
          aria-label="docket record"
          className="usa-table ustc-table usa-table--stacked"
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
              <th>Filed Date</th>
              <th className="center-column">Event</th>
              <th aria-hidden="true" className="icon-column" />
              <th>Filings and Proceedings</th>
              <th>Pages</th>
              <th>Filed By</th>
              <th>Action</th>
              <th>Served</th>
              <th className="center-column">Parties</th>
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
                    <td className="hide-on-mobile">{entry.numberOfPages}</td>
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
      </>
    );
  },
);

PublicDocketRecord.displayName = 'PublicDocketRecord';
