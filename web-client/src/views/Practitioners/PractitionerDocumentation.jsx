import { Button } from '../../ustc-ui/Button/Button';
import { DeletePractitionerDocumentConfirmModal } from './DeletePractitionerDocumentConfirmModal';
import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PractitionerDocumentation = connect(
  {
    barNumber: state.practitionerDetail.barNumber,
    constants: state.constants,
    openDeletePractitionerDocumentConfirmModalSequence:
      sequences.openDeletePractitionerDocumentConfirmModalSequence,
    openPractitionerDocumentDownloadUrlSequence:
      sequences.openPractitionerDocumentDownloadUrlSequence,
    practitionerDocumentationHelper: state.practitionerDocumentationHelper,
    showModal: state.modal.showModal,
    sortTableSequence: sequences.sortTableSequence,
  },
  function PractitionerDocumentation({
    barNumber,
    constants,
    openDeletePractitionerDocumentConfirmModalSequence,
    openPractitionerDocumentDownloadUrlSequence,
    practitionerDocumentationHelper,
    showModal,
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
                <tr key={document.practitionerDocumentFileId}>
                  <td className="uploadDate">{document.formattedUploadDate}</td>
                  <td>
                    <Button
                      link
                      aria-label={`View PDF: ${document.fileName}`}
                      className="text-left padding-0 file-name-button"
                      onClick={() => {
                        openPractitionerDocumentDownloadUrlSequence({
                          barNumber,
                          fileName: document.fileName,
                          practitionerDocumentFileId:
                            document.practitionerDocumentFileId,
                        });
                      }}
                    >
                      {document.fileName}
                    </Button>
                  </td>

                  <td className="categoryName">{document.categoryName}</td>
                  <td className="file-description">{document.description}</td>
                  <td className="text-align-left edit-delete-buttons">
                    <Button
                      link
                      href={`/practitioner-detail/${barNumber}/edit-document/${document.practitionerDocumentFileId}`}
                      icon="edit"
                    >
                      Edit
                    </Button>
                    <Button
                      link
                      className="red-warning margin-right-0"
                      icon="trash"
                      onClick={() => {
                        openDeletePractitionerDocumentConfirmModalSequence({
                          barNumber,
                          practitionerDocumentFileId:
                            document.practitionerDocumentFileId,
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        {showModal === 'DeletePractitionerDocumentConfirmModal' && (
          <DeletePractitionerDocumentConfirmModal onConfirmSequence="deletePractitionerDocumentSequence" />
        )}
      </>
    );
  },
);
