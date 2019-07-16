import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SupportingDocumentForm } from './SupportingDocumentForm';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SupportingDocuments = connect(
  {
    addSupportingDocumentToFormSequence:
      sequences.addSupportingDocumentToFormSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
  },
  ({ addSupportingDocumentToFormSequence, fileDocumentHelper, form }) => {
    return (
      <>
        {form.hasSupportingDocuments &&
          form.supportingDocuments.map((item, idx) => (
            <SupportingDocumentForm index={idx} key={idx} />
          ))}

        {fileDocumentHelper.showAddSupportingDocuments && (
          <button
            className="usa-button usa-button--outline margin-top-205"
            onClick={() => {
              addSupportingDocumentToFormSequence({ type: 'primary' });
            }}
          >
            <FontAwesomeIcon
              className="margin-right-05"
              icon="plus-circle"
              size="1x"
            />
            Add Supporting Document
          </button>
        )}
      </>
    );
  },
);
