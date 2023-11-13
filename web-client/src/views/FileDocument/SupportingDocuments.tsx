import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SupportingDocumentForm } from './SupportingDocumentForm';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SupportingDocuments = connect(
  {
    addSupportingDocumentToFormSequence:
      sequences.addSupportingDocumentToFormSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
  },
  function SupportingDocuments({
    addSupportingDocumentToFormSequence,
    fileDocumentHelper,
    form,
  }) {
    return (
      <>
        {form.hasSupportingDocuments &&
          form.supportingDocuments.map((item, idx) => (
            <SupportingDocumentForm
              index={idx}
              key={`supporting-doc-${item.documentTitle}`}
            />
          ))}

        {fileDocumentHelper.showAddSupportingDocuments && (
          <Button
            secondary
            className="margin-top-205"
            id="add-supporting-document-button"
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
          </Button>
        )}

        {fileDocumentHelper.showAddSupportingDocumentsLimitReached && (
          <p>
            You can only add 5 supporting documents at a time. You may file
            another supporting document in a separate filing.
          </p>
        )}
      </>
    );
  },
);

SupportingDocuments.displayName = 'SupportingDocuments';
