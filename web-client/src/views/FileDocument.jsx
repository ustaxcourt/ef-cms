import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export default connect(
  {
    document: state.document,
    submitDocumentSequence: sequences.submitDocumentSequence,
    submitting: state.submitting,
    updateCurrentTabSequence: sequences.updateCurrentTabSequence,
    updateDocumentValueSequence: sequences.updateDocumentValueSequence,
  },
  function FilePetition({
    document,
    submitDocumentSequence,
    submitting,
    updateCurrentTabSequence,
    updateDocumentValueSequence,
  }) {
    return (
      <React.Fragment>
        <h2>File a document</h2>
        <form
          id="file-a-document"
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
            <option value>- Select -</option>
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
  },
);
