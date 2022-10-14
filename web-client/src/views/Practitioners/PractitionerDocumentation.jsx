// import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PractitionerDocumentation = connect(
  {
    barNumber: state.practitionerDetail.barNumber,
    constants: state.constants,
    openPractitionerDocumentDownloadUrlSequence:
      sequences.openPractitionerDocumentDownloadUrlSequence,
    practitionerDocumentationHelper: state.practitionerDocumentationHelper,
  },
  function PractitionerDocumentation({
    barNumber,
    openPractitionerDocumentDownloadUrlSequence,
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
            {practitionerDocumentationHelper.formattedPractitionerDocuments.map(
              document => (
                <tr key={document.practitionerDocumentFileId}>
                  <td>{document.formattedUploadDate}</td>
                  <td>
                    <Button
                      link
                      aria-label={`View PDF: ${document.fileName}`}
                      onClick={() =>
                        openPractitionerDocumentDownloadUrlSequence({
                          fileName: document.fileName,
                          practitionerDocumentFileId:
                            document.practitionerDocumentFileId,
                        })
                      }
                    >
                      {document.fileName}
                    </Button>
                  </td>

                  <td>{document.categoryName}</td>
                  <td>{document.description}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </>
    );
  },
);
