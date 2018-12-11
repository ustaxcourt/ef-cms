import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export default connect(
  {
    document: state.document,
    submitDocument: sequences.submitDocument,
    submitting: state.submitting,
    updateDocumentValue: sequences.updateDocumentValue,
  },
  function FilePetition({
    document,
    submitDocument,
    submitting,
    updateDocumentValue,
  }) {
    return (
      <section className="usa-section usa-grid">
        <h2>File a document</h2>
        <form
          id="file-a-document"
          role="form"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            submitDocument();
          }}
        >
          <label htmlFor="file" className={document.file && 'validated'}>
            Select file
          </label>
          <input
            id="file"
            type="file"
            accept=".pdf"
            name="file"
            onChange={e => {
              updateDocumentValue({
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
          <button type="button" className="usa-button-secondary">
            Cancel
          </button>
        </form>
      </section>
    );
  },
);
