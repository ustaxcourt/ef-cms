import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import PropTypes from 'prop-types';

class FilePetition extends React.Component {
  componentDidMount() {
    this.focusMain();
  }
  focusMain(e) {
    e && e.preventDefault();
    document.querySelector('#file-a-document-header').focus();
    return false;
  }
  render() {
    const document = this.props.document;
    const submitDocumentSequence = this.props.submitDocumentSequence;
    const submitting = this.props.submitting;
    const updateCurrentTabSequence = this.props.updateCurrentTabSequence;
    const updateDocumentValueSequence = this.props.updateDocumentValueSequence;

    return (
      <React.Fragment>
        <h2 tabIndex="-1" id="file-a-document-header">
          File a document
        </h2>
        <form
          id="file-a-document"
          aria-labelledby="file-a-document-header"
          role="form"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            submitDocumentSequence();
          }}
        >
          <label htmlFor="document-type">Document type</label>
          <select
            name="documentType"
            id="document-type"
            onChange={e => {
              updateDocumentValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          >
            <option value="Select">- Select -</option>
            <option value="Answer">Answer</option>
            <option value="Stipulated Decision">Stipulated Decision</option>
          </select>
          <label htmlFor="file" className={document.file && 'validated'}>
            Select file
          </label>
          <input
            id="file"
            type="file"
            accept=".pdf"
            name="file"
            onChange={e => {
              updateDocumentValueSequence({
                key: e.target.name,
                value: e.target.files[0],
              });
            }}
          />
          <button
            type="submit"
            disabled={submitting}
            className={submitting ? 'usa-button-active' : 'usa-button'}
            aria-disabled={submitting ? 'true' : 'false'}
          >
            <span>{submitting ? 'Uploading...' : 'Upload'}</span>
            {submitting && <div className="spinner" />}
          </button>
          <button
            type="button"
            className="usa-button-secondary"
            onClick={() => updateCurrentTabSequence({ value: 'Docket Record' })}
          >
            Cancel
          </button>
        </form>
      </React.Fragment>
    );
  }
}

FilePetition.propTypes = {
  document: PropTypes.object,
  submitDocumentSequence: PropTypes.func,
  submitting: PropTypes.bool,
  updateCurrentTabSequence: PropTypes.func,
  updateDocumentValueSequence: PropTypes.func,
};

export default connect(
  {
    document: state.document,
    submitDocumentSequence: sequences.submitDocumentSequence,
    submitting: state.submitting,
    updateCurrentTabSequence: sequences.updateCurrentTabSequence,
    updateDocumentValueSequence: sequences.updateDocumentValueSequence,
  },
  FilePetition,
);
