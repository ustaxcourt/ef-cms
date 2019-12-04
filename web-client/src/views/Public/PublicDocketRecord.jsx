import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PublicDocketRecordHeader } from './PublicDocketRecordHeader';
import { PublicFilingsAndProceedings } from './PublicFilingsAndProceedings';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PublicDocketRecord = connect(
  {
    publicCaseDetailHelper: state.publicCaseDetailHelper,
  },
  ({ publicCaseDetailHelper }) => {
    return (
      <React.Fragment>
        <div className="title">
          <h1>Docket Record</h1>
        </div>
        <PublicDocketRecordHeader />
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
            {publicCaseDetailHelper.formattedDocketRecordWithDocument.map(
              ({ document, index, record }) => {
                return (
                  <tr key={index}>
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
                      {document && document.isPaper && (
                        <FontAwesomeIcon icon={['fas', 'file-alt']} />
                      )}
                    </td>
                    <td>
                      <PublicFilingsAndProceedings
                        document={document}
                        record={record}
                      />
                    </td>
                    <td className="hide-on-mobile">
                      {document && document.filedBy}
                    </td>
                    <td className="hide-on-mobile">{record.action}</td>
                    <td>
                      {document && document.isNotServedCourtIssuedDocument && (
                        <span className="text-secondary text-semibold">
                          Not served
                        </span>
                      )}
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
      </React.Fragment>
    );
  },
);
