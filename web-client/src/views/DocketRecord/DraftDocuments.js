import { FilingsAndProceedings } from './FilingsAndProceedings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DraftDocuments = connect(
  {
    caseDetail: state.formattedCaseDetail,
  },
  ({ caseDetail }) => {
    return (
      <React.Fragment>
        <table
          aria-label="draft documents"
          className="usa-table case-detail draft-documents responsive-table row-border-only"
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Filings and Proceedings</th>
              <th>Created By</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {/* TODO: Update draftDocuments with whatever it ends up being, and remove existential check */}
            {caseDetail.draftDocuments &&
              caseDetail.draftDocuments.map(
                ({ draftDocument, record }, index) => {
                  return (
                    <tr key={index}>
                      <td>{draftDocument.createdAtFormatted}</td>
                      <td>
                        <FilingsAndProceedings
                          arrayIndex={index}
                          document={draftDocument}
                          record={record}
                        />
                        {FilingsAndProceedings}
                      </td>
                      <td>{record.filedBy}</td>
                      <td className="no-wrap text-align-right">
                        {/* TODO: Link to the document to edit */}
                        <a
                          className="usa-button usa-button--unstyled"
                          href={`/case-detail/${caseDetail.docketNumber}`}
                        >
                          <FontAwesomeIcon icon="edit" size="sm" />
                          Edit
                        </a>
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
