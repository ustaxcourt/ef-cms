import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const FileDocument = connect(
  {
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    form: state.form,
  },
  ({ form, chooseWizardStepSequence }) => {
    return (
      <React.Fragment>
        <h2 tabIndex="-1" id="file-a-document-header">
          File a Document
        </h2>
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
      </React.Fragment>
    );
  },
);
