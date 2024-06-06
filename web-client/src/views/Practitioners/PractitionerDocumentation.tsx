import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmModal } from '@web-client/ustc-ui/Modal/ConfirmModal';
import { SortableColumn } from '../../ustc-ui/Table/SortableColumn';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PractitionerDocumentation = connect(
  {
    barNumber: state.practitionerDetail.barNumber,
    clearModalSequence: sequences.clearModalSequence,
    constants: state.constants,
    deletePractitionerDocumentSequence:
      sequences.deletePractitionerDocumentSequence,
    openDeletePractitionerDocumentConfirmModalSequence:
      sequences.openDeletePractitionerDocumentConfirmModalSequence,
    openPractitionerDocumentDownloadUrlSequence:
      sequences.openPractitionerDocumentDownloadUrlSequence,
    practitionerDocumentationHelper: state.practitionerDocumentationHelper,
    showModal: state.modal.showModal,
    sortTableSequence: sequences.sortTableSequence,
    tableSort: state.tableSort,
  },
  function PractitionerDocumentation({
    barNumber,
    clearModalSequence,
    constants,
    deletePractitionerDocumentSequence,
    openDeletePractitionerDocumentConfirmModalSequence,
    openPractitionerDocumentDownloadUrlSequence,
    practitionerDocumentationHelper,
    showModal,
    sortTableSequence,
    tableSort,
  }) {
    return (
      <>
        <div className="display-flex flex-justify-end">
          <Button
            link
            className="push-right margin-bottom-1"
            data-testid="add-practitioner-document-button"
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
                <SortableColumn
                  ascText={constants.CHRONOLOGICALLY_ASCENDING}
                  currentlySortedField={tableSort.sortField}
                  currentlySortedOrder={tableSort.sortOrder}
                  defaultSortOrder={constants.ASCENDING}
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
                <SortableColumn
                  ascText={constants.ALPHABETICALLY_ASCENDING}
                  currentlySortedField={tableSort.sortField}
                  currentlySortedOrder={tableSort.sortOrder}
                  defaultSortOrder={constants.ASCENDING}
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
                <SortableColumn
                  ascText={constants.ALPHABETICALLY_ASCENDING}
                  currentlySortedField={tableSort.sortField}
                  currentlySortedOrder={tableSort.sortOrder}
                  defaultSortOrder={constants.ASCENDING}
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
                <SortableColumn
                  ascText={constants.ALPHABETICALLY_ASCENDING}
                  currentlySortedField={tableSort.sortField}
                  currentlySortedOrder={tableSort.sortOrder}
                  defaultSortOrder={constants.ASCENDING}
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
          <ConfirmModal
            cancelLabel="No, Cancel"
            confirmLabel="Yes, Delete"
            title="Are You Sure You Want to Delete This Document?"
            onCancelSequence={clearModalSequence}
            onConfirmSequence={deletePractitionerDocumentSequence}
          >
            <p>This action cannot be undone.</p>
          </ConfirmModal>
        )}
      </>
    );
  },
);

PractitionerDocumentation.displayName = 'PractitionerDocumentation';
