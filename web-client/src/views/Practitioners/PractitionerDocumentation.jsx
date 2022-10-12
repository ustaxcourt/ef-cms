import { Button } from '../../ustc-ui/Button/Button';
import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
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
    sortTableSequence: sequences.sortTableSequence,
  },
  function PractitionerDocumentation({
    barNumber,
    constants,
    openPractitionerDocumentDownloadUrlSequence,
    practitionerDocumentationHelper,
    sortTableSequence,
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
              <th aria-label="Date Uploaded">
                <SortableColumnHeaderButton
                  ascText={constants.CHRONOLOGICALLY_ASCENDING}
                  defaultSort={constants.ASCENDING}
                  descText={constants.ALPHABETICALLY_DESCENDING}
                  hasRows={
                    practitionerDocumentationHelper
                      .formattedPractitionerDocuments.length
                  }
                  sortField="uploadDate"
                  title="Date Uploaded"
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th>
                <SortableColumnHeaderButton
                  ascText={constants.ALPHABETICALLY_ASCENDING}
                  defaultSort={constants.ASCENDING}
                  descText={constants.ALPHABETICALLY_DESCENDING}
                  hasRows={
                    practitionerDocumentationHelper
                      .formattedPractitionerDocuments.length
                  }
                  sortField="fileName"
                  title="File Name"
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th>
                <SortableColumnHeaderButton
                  ascText={constants.ALPHABETICALLY_ASCENDING}
                  defaultSort={constants.ASCENDING}
                  descText={constants.ALPHABETICALLY_DESCENDING}
                  hasRows={
                    practitionerDocumentationHelper
                      .formattedPractitionerDocuments.length
                  }
                  sortField="categoryName"
                  title="Category"
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th>
                <SortableColumnHeaderButton
                  ascText={constants.ALPHABETICALLY_ASCENDING}
                  defaultSort={constants.ASCENDING}
                  descText={constants.ALPHABETICALLY_DESCENDING}
                  hasRows={
                    practitionerDocumentationHelper
                      .formattedPractitionerDocuments.length
                  }
                  sortField="description"
                  title="Description"
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {practitionerDocumentationHelper.formattedPractitionerDocuments.map(
              document => (
                <tr key={document.documentId}>
                  <td>{document.formattedUploadDate}</td>
                  <td>
                    <Button
                      link
                      aria-label={`View PDF: ${document.fileName}`}
                      onClick={() =>
                        openPractitionerDocumentDownloadUrlSequence({
                          barNumber,
                          documentId: document.documentId,
                        })
                      }
                    >
                      {document.fileName}
                    </Button>
                  </td>

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
