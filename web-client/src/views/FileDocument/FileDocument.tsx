import { Button } from '../../ustc-ui/Button/Button';
import { ExternalConsolidatedCaseGroupFilingCard } from './ExternalConsolidatedCaseGroupFilingCard';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { PartiesFiling } from './PartiesFiling';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { PrimaryDocumentGeneratedTypeForm } from '@web-client/views/FileDocument/PrimaryDocumentGeneratedTypeForm';
import { SecondaryDocumentForm } from './SecondaryDocumentForm';
import { SecondarySupportingDocuments } from './SecondarySupportingDocuments';
import { SupportingDocuments } from './SupportingDocuments';
import { WhatCanIIncludeModalOverlay } from './WhatCanIIncludeModalOverlay';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

// TODO Nate: This appears to be the _current_ 'File a document' page / form.
// In the EA flow, we need to swap out this form for the EA specific form.
// Q: where is the EA-specific form?
export const FileDocument = connect(
  {
    constants: state.constants,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    reviewExternalDocumentInformationSequence:
      sequences.reviewExternalDocumentInformationSequence,
    showModal: state.modal.showModal,
    updateCaseAssociationFormValueSequence:
      sequences.updateCaseAssociationFormValueSequence,
  },
  function FileDocument({
    fileDocumentHelper,
    formCancelToggleCancelSequence,
    navigateBackSequence,
    reviewExternalDocumentInformationSequence,
    showModal,
  }) {
    return (
      <div className="grid-container">
        <Focus>
          <h1
            className="margin-bottom-105"
            id="file-a-document-header"
            tabIndex={-1}
          >
            File Your Document(s)
          </h1>
        </Focus>

        <p className="margin-bottom-3 margin-top-0 required-statement">
          *All fields required unless otherwise noted
        </p>

        {fileDocumentHelper.showGenerationTypeForm ? (
          <PrimaryDocumentGeneratedTypeForm />
        ) : (
          <>
            <PrimaryDocumentForm />
            <SupportingDocuments />
            {fileDocumentHelper.showSecondaryDocument && (
              <>
                <SecondaryDocumentForm />
                <SecondarySupportingDocuments />
              </>
            )}
            <PartiesFiling />
          </>
        )}

        {fileDocumentHelper.allowExternalConsolidatedGroupFiling && (
          <ExternalConsolidatedCaseGroupFilingCard />
        )}

        <div className="margin-top-4">
          <Button
            id="submit-document"
            type="submit"
            onClick={() => {
              reviewExternalDocumentInformationSequence();
            }}
          >
            Review Filing
          </Button>
          <Button secondary onClick={() => navigateBackSequence()}>
            Back
          </Button>
          <Button
            link
            onClick={() => {
              formCancelToggleCancelSequence();
            }}
          >
            Cancel
          </Button>
        </div>

        {showModal === 'WhatCanIIncludeModalOverlay' && (
          <WhatCanIIncludeModalOverlay />
        )}
      </div>
    );
  },
);

FileDocument.displayName = 'FileDocument';
