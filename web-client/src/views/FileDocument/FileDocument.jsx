import { Focus } from '../../ustc-ui/Focus/Focus';
import { PartiesFiling } from './PartiesFiling';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { SecondaryDocumentForm } from './SecondaryDocumentForm';
import { SecondarySupportingDocuments } from './SecondarySupportingDocuments';
import { SupportingDocuments } from './SupportingDocuments';
import { WhatCanIIncludeModalOverlay } from './WhatCanIIncludeModalOverlay';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const FileDocument = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    reviewExternalDocumentInformationSequence:
      sequences.reviewExternalDocumentInformationSequence,
    showModal: state.showModal,
  },
  ({
    form,
    formCancelToggleCancelSequence,
    navigateBackSequence,
    reviewExternalDocumentInformationSequence,
    showModal,
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
            className="usa-button margin-right-205 margin-bottom-1"
            id="submit-document"
            type="submit"
            onClick={() => {
              reviewExternalDocumentInformationSequence();
            }}
          >
            Review Filing
          </button>
          <button
            className="usa-button usa-button--outline margin-bottom-1"
            type="button"
            onClick={() => navigateBackSequence()}
          >
            Back
          </button>
          <button
            className="usa-button usa-button--unstyled ustc-button--unstyled"
            type="button"
            onClick={() => {
              formCancelToggleCancelSequence();
            }}
          >
            Cancel
          </button>
        </div>

        {showModal === 'WhatCanIIncludeModalOverlay' && (
          <WhatCanIIncludeModalOverlay />
        )}
      </React.Fragment>
    );
  },
);
