import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import ErrorNotification from './ErrorNotification';

export default connect(
  {
    submitDocument: sequences.submitDocument,
    updateDocumentValue: sequences.updateDocumentValue,
    submitting: state.submitting,
    document: state.document,
  },
  function FilePetition({
    submitDocument,
    updateDocumentValue,
    submitting,
    document,
  }) {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1" id="file-h1">
          File a document
        </h1>
        <ErrorNotification />
        <form
          id="file-a-document"
          role="form"
          aria-labelledby="#file-h1"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            submitDocument();
          }}
        >
          <div role="list">
            <div role="listitem" className="usa-form-group">
              <label htmlFor="file" className={document.file && 'validated'}>
                Select a file
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
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={submitting ? 'usa-button-active' : 'usa-button'}
            aria-disabled={submitting ? 'true' : 'false'}
          >
            <span>{submitting ? 'Uploading...' : 'Upload'}</span>
            {submitting && <div className="spinner" />}
          </button>
        </form>
      </section>
    );
  },
);
