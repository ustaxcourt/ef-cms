import React from 'react';
import { sequences, state } from 'cerebral';
import { connect } from '@cerebral/react';

import ErrorNotification from './ErrorNotification';

export default connect(
  {
    submitFilePetition: sequences.submitFilePetition,
    updatePetitionValue: sequences.updatePetitionValue,
    submitting: state.submitting,
  },
  function FilePetition({
    submitFilePetition,
    updatePetitionValue,
    submitting,
  }) {
    return (
      <section className="usa-section usa-grid">
        <h1>File a petition</h1>
        <h2>Please upload the following PDFs</h2>
        <p>* All are required.</p>
        <ErrorNotification />
        <form
          id="file-a-petition"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            submitFilePetition();
          }}
        >
          <div className="usa-form-group">
            <label htmlFor="petition-file">1. Petition file (form #)</label>
            <span>Contains details about your case</span>
            <input
              id="petition-file"
              type="file"
              accept=".pdf"
              name="petitionFile"
              onChange={e => {
                updatePetitionValue({
                  key: e.target.name,
                  file: e.target.files[0],
                });
              }}
            />
          </div>
          <div className="usa-form-group">
            <label htmlFor="request-for-place-of-trial">
              2. Request for place of trial (form #5)
            </label>
            <span>To submit the city and state for your trial</span>
            <input
              id="request-for-place-of-trial"
              type="file"
              accept=".pdf"
              name="requestForPlaceOfTrial"
              onChange={e => {
                updatePetitionValue({
                  key: e.target.name,
                  file: e.target.files[0],
                });
              }}
            />
          </div>
          <div className="usa-form-group">
            <label htmlFor="statement-of-taxpayer-id">
              3. Statement of taxpayer identification number (form #4)
            </label>
            <span>
              To submit your Social Security number or employee identification
              number
            </span>
            <input
              id="statement-of-taxpayer-id"
              type="file"
              accept=".pdf"
              name="statementOfTaxpayerIdentificationNumber"
              onChange={e => {
                updatePetitionValue({
                  key: e.target.name,
                  file: e.target.files[0],
                });
              }}
            />
          </div>
          {!submitting && (
            <button type="submit">
              <span>Upload</span>
            </button>
          )}
          {submitting && (
            <button type="submit" disabled>
              <span>Uploading...</span>
              <div className="spinner" />
            </button>
          )}
        </form>
      </section>
    );
  },
);
