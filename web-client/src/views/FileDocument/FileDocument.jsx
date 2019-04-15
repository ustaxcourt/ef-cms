import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PartiesFiling } from './PartiesFiling';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { SecondaryDocumentForm } from './SecondaryDocumentForm';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const FileDocument = connect(
  {
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    submitExternalDocumentInformationSequence:
      sequences.submitExternalDocumentInformationSequence,
  },
  ({
    chooseWizardStepSequence,
    form,
    formCancelToggleCancelSequence,
    submitExternalDocumentInformationSequence,
  }) => {
    return (
      <React.Fragment>
        <Focus>
          <h2 tabIndex="-1" id="file-a-document-header">
            File a Document
          </h2>
        </Focus>
        <p>All fields required unless otherwise noted</p>
        <div>
          <h3 className="type-of-document">Type of Document You’re Filing</h3>
          <button
            className="link"
            type="button"
            onClick={() =>
              chooseWizardStepSequence({ value: 'SelectDocumentType' })
            }
          >
            <FontAwesomeIcon icon="edit" size="sm" />
            Edit
          </button>
        </div>
        <div className="blue-container">
          <FontAwesomeIcon icon={['far', 'file-alt']} />
          <h4 className="file-name">{form.documentTitle}</h4>
        </div>

        <PrimaryDocumentForm />

        {form.secondaryDocument.documentTitle && <SecondaryDocumentForm />}

        <PartiesFiling />

        <div className="button-box-container">
          <button
            id="submit-document"
            type="submit"
            className="usa-button"
            onClick={() => {
              submitExternalDocumentInformationSequence();
            }}
          >
            Review Filing
          </button>
          <button
            type="button"
            className="usa-button-secondary"
            onClick={() => {
              formCancelToggleCancelSequence();
              return false;
            }}
          >
            Cancel
          </button>
        </div>
      </React.Fragment>
    );
  },
);
