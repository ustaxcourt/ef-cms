import { Focus } from '../../ustc-ui/Focus/Focus';
import { PartiesFiling } from './PartiesFiling';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { SecondaryDocumentForm } from './SecondaryDocumentForm';
import { SecondarySupportingDocumentForm } from './SecondarySupportingDocumentForm';
import { SupportingDocumentForm } from './SupportingDocumentForm';
import { WhatCanIIncludeModalOverlay } from './WhatCanIIncludeModalOverlay';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const FileDocument = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    reviewExternalDocumentInformationSequence:
      sequences.reviewExternalDocumentInformationSequence,
    showModal: state.showModal,
  },
  ({
    form,
    formCancelToggleCancelSequence,
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

        <SupportingDocumentForm />

        {form.secondaryDocument.documentTitle && (
          <>
            <SecondaryDocumentForm /> <SecondarySupportingDocumentForm />
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

        {showModal === 'WhatCanIIncludeModalOverlay' && (
          <WhatCanIIncludeModalOverlay />
        )}
      </React.Fragment>
    );
  },
);
