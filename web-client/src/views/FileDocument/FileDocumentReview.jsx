import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { PartiesFilingReadOnly } from './PartiesFilingReadOnly';
import { PrimaryDocumentReadOnly } from './PrimaryDocumentReadOnly';
import { SecondaryDocumentReadOnly } from './SecondaryDocumentReadOnly';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const FileDocumentReview = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.showModal,
    submitExternalDocumentSequence: sequences.submitExternalDocumentSequence,
  },
  ({
    form,
    formCancelToggleCancelSequence,
    showModal,
    submitExternalDocumentSequence,
  }) => {
    return (
      <React.Fragment>
        <Focus>
          <h1 className="heading-1" id="file-a-document-header" tabIndex="-1">
            Review Your Filing
          </h1>
        </Focus>

        <p>
          You can’t edit your filing once you submit it. Please make sure your
          information appears the way you want it to.
        </p>

        <Hint>
          Don’t forget to check your PDF(s) to ensure all personal information
          has been removed or redacted.
        </Hint>

        <PrimaryDocumentReadOnly />

        {form.secondaryDocument.documentTitle && <SecondaryDocumentReadOnly />}

        <PartiesFilingReadOnly />

        <div className="button-box-container">
          <button
            className="usa-button"
            id="submit-document"
            type="submit"
            onClick={() => {
              submitExternalDocumentSequence();
            }}
          >
            Submit Your Filing
          </button>
          <button
            className="usa-button usa-button--outline"
            type="button"
            onClick={() => {
              formCancelToggleCancelSequence();
            }}
          >
            Cancel
          </button>
        </div>
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal
            confirmSequence={submitExternalDocumentSequence}
          />
        )}
      </React.Fragment>
    );
  },
);
