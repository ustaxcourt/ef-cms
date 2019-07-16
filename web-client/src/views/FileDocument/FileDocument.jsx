import { Focus } from '../../ustc-ui/Focus/Focus';
import { PartiesFiling } from './PartiesFiling';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { SecondaryDocumentForm } from './SecondaryDocumentForm';
import { SecondarySupportingDocuments } from './SecondarySupportingDocuments';
import { SupportingDocuments } from './SupportingDocuments';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const FileDocument = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    reviewExternalDocumentInformationSequence:
      sequences.reviewExternalDocumentInformationSequence,
  },
  ({
    form,
    formCancelToggleCancelSequence,
    reviewExternalDocumentInformationSequence,
  }) => {
    return (
      <React.Fragment>
        <Focus>
          <h1
            className="margin-bottom-05"
            id="file-a-document-header"
            tabIndex="-1"
          >
            File Your Document(s)
          </h1>
        </Focus>
        <p className="margin-bottom-5 required-statement margin-top-05 ">
          All fields required unless otherwise noted
        </p>

        <PrimaryDocumentForm />

        <SupportingDocuments />

        {form.secondaryDocument.documentTitle && (
          <>
            <SecondaryDocumentForm />
            <SecondarySupportingDocuments />
          </>
        )}

        <PartiesFiling />

        <div className="button-box-container margin-top-4">
          <button
            className="usa-button margin-right-205"
            id="submit-document"
            type="submit"
            onClick={() => {
              reviewExternalDocumentInformationSequence();
            }}
          >
            Review Filing
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
      </React.Fragment>
    );
  },
);
