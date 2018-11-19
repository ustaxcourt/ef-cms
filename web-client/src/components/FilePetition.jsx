import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import ErrorNotification from './ErrorNotification';

export default connect(
  {
    submitFilePetition: sequences.submitFilePetition,
    updatePetitionValue: sequences.updatePetitionValue,
    submitting: state.submitting,
    petition: state.petition,
  },
  function FilePetition({
    submitFilePetition,
    updatePetitionValue,
    submitting,
    petition,
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
          <div role="list">
            <div role="listitem" className="usa-form-group">
              <label
                htmlFor="petition-file"
                className={petition.petitionFile.file && 'validated'}
              >
                1. Petition file (form #2)
              </label>
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
            <div role="listitem" className="usa-form-group">
              <label
                htmlFor="request-for-place-of-trial"
                className={petition.requestForPlaceOfTrial.file && 'validated'}
              >
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
            <div role="listitem" className="usa-form-group">
              <label
                htmlFor="statement-of-taxpayer-id"
                className={
                  petition.statementOfTaxpayerIdentificationNumber.file &&
                  'validated'
                }
              >
                3. Statement of Taxpayer Identification Number (form #4)
              </label>
              <span>
                To submit your Taxpayer Identification Number (e.g., your Social
                Security number, Employee Identification Number, etc.)
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
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={submitting ? 'usa-button-active' : 'usa-button'}
            aria-disabled={submitting ? 'true' : 'false'}
            aria-live="polite"
          >
            <span>{submitting ? 'Uploading...' : 'Upload'}</span>
            {submitting && <div className="spinner" />}
          </button>
          {submitting && (
            <div aria-live="assertive" aria-atomic="true">
              <p>{3 - petition.uploadsFinished} of 3 remaining</p>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: (petition.uploadsFinished * 100) / 3 + '%' }}
                />
              </div>
            </div>
          )}
        </form>
      </section>
    );
  },
);
