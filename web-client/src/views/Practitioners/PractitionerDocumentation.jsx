// import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PractitionerDocumentation = connect(
  {
    barNumber: state.practitionerDetail.barNumber,
    constants: state.constants,
    practitionerDetailHelper: state.practitionerDetailHelper,
    practitionerDocuments: state.practitionerDocuments,
  },
  function PractitionerDocumentation({ barNumber, practitionerDocuments }) {
    return (
      <>
        <div className="display-flex flex-justify-end">
          <Button
            link
            className="push-right margin-bottom-1"
            href={`/practitioner-detail/${barNumber}/add-document`}
            icon="plus-circle"
          >
            Add file
          </Button>
        </div>
        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              <th>
                <th aria-label="Date Uploaded" className="small" colSpan="2">
                  Date Uploaded
                </th>
              </th>
              <th>File Name</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {practitionerDocuments.map(document => (
              <tr key={document.documentId}>
                <td>TODO</td>
                <td>{document.fileName}</td>
                <td>{document.categoryName}</td>
                <td>{document.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  },
);
