import { DocumentCategoryAccordion } from '../FileDocument/DocumentCategoryAccordion';
import { DocumentType } from '../FileDocument/DocumentType';
import { DocumentTypeReadOnly } from '../FileDocument/DocumentTypeReadOnly';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const RequestAccessDocumentType = connect(
  {
    screenMetadata: state.screenMetadata,
    selectDocumentSequence: sequences.selectDocumentSequence,
    submitting: state.submitting,
    toggleDocumentCategoryAccordionSequence:
      sequences.toggleDocumentCategoryAccordionSequence,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
  },
  ({
    selectDocumentSequence,
    toggleDocumentCategoryAccordionSequence,
    updateFileDocumentWizardFormValueSequence,
    screenMetadata,
  }) => {
    return (
      <React.Fragment>
        <h3>What Type of Document Are You Filing?</h3>
      </React.Fragment>
    );
  },
);
