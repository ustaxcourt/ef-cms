import { Focus } from '../../ustc-ui/Focus/Focus';
import { PartiesRepresentingReadOnly } from './PartiesRepresentingReadOnly';
import { RequestAccessDocumentReadOnly } from './RequestAccessDocumentReadOnly';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const RequestAccessReview = connect(
  {
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    submitCaseAssociationRequestSequence:
      sequences.submitCaseAssociationRequestSequence,
  },
  ({
    formCancelToggleCancelSequence,
    submitCaseAssociationRequestSequence,
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

        <div id="file-document-hint" className="usa-alert usa-alert-warning">
          <div className="usa-alert-body">
            <h3 className="usa-alert-heading">Before You Submit...</h3>
            <p className="usa-alert-text">
              Verify the documents you uploaded are correct and ensure all
              personal information has been removed or redacted from your
              documents.
            </p>
          </div>
        </div>

        <RequestAccessDocumentReadOnly />

        <PartiesRepresentingReadOnly />

        <div className="button-box-container">
          <button
            id="submit-document"
            type="submit"
            className="usa-button"
            onClick={() => {
              submitCaseAssociationRequestSequence();
            }}
          >
            Submit Your Filing
          </button>
          <button
            type="button"
            className="usa-button usa-button--outline"
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
