import { Focus } from '../../ustc-ui/Focus/Focus';
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
    submitExternalDocumentSequence: sequences.submitExternalDocumentSequence,
  },
  ({
    form,
    formCancelToggleCancelSequence,
    submitExternalDocumentSequence,
  }) => {
    return (
      <React.Fragment>
        <Focus>
          <h2 tabIndex="-1" id="file-a-document-header">
            Review Your Filing
          </h2>
        </Focus>
        <p>
          You can’t edit your filing once you submit it. Please make sure your
          information appears the way you want it to.
        </p>

        <div
          id="file-document-hint"
          className="usa-alert usa-alert-warning usa-alert-paragraph"
        >
          <div className="usa-alert-body">
            <h3 className="usa-alert-heading">Before You Submit...</h3>
            <p className="usa-alert-text">
              Verify the documents you uploaded are correct and ensure all
              personal information has been removed or redacted from your
              documents.
            </p>
          </div>
        </div>

        <PrimaryDocumentReadOnly />

        {form.secondaryDocument.documentTitle && <SecondaryDocumentReadOnly />}

        <PartiesFilingReadOnly />

        <div className="button-box-container">
          <button
            id="submit-document"
            type="submit"
            className="usa-button"
            onClick={() => {
              submitExternalDocumentSequence();
            }}
          >
            Submit Your Filing
          </button>
          <button
            type="button"
            className="usa-button-secondary"
            onClick={() => {
              formCancelToggleCancelSequence();
            }}
          >
            Cancel
          </button>
        </div>
      </React.Fragment>
    );
  },
);
