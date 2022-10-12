// import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PractitionerDocumentation = connect(
  {
    barNumber: state.practitionerDetail.barNumber,
    constants: state.constants,
    practitionerDocumentationHelper: state.practitionerDocumentationHelper,
  },
  function PractitionerDocumentation({
    barNumber,
    practitionerDocumentationHelper,
  }) {
    return (
      <>
        <div className="display-flex flex-justify-end">
          <Button
            link
            className="push-right margin-bottom-1"
            href={`/practitioner-detail/${barNumber}/add-document`}
            icon="plus-circle"
            overrideMargin={true}
          >
            Add file
          </Button>
        </div>
        <div className="float-right text-semibold margin-bottom-2">
          Count:{' '}
          <span className="text-normal">
            {practitionerDocumentationHelper.practitionerDocumentsCount}
          </span>
        </div>
        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              <th aria-label="Date Uploaded">Date Uploaded</th>
              <th>File Name</th>
              <th>Category</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {practitionerDocumentationHelper.formattedPractitionerDocuments.map(
              document => (
                <tr key={document.documentId}>
                  <td>{document.formattedUploadDate}</td>
                  <td>{document.fileName}</td>
                  <td>{document.categoryName}</td>
                  <td>{document.description}</td>
                  <td className="text-align-right">
                    <Button link icon="edit" onClick={() => {}}>
                      Edit
                    </Button>
                    <Button
                      link
                      className="red-warning"
                      icon="trash"
                      onClick={() => {}}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </>
    );
  },
);
