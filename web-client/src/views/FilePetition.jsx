import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import ErrorNotification from './ErrorNotification';

export default connect(
  {
    petition: state.petition,
    submitFilePetitionSequence: sequences.submitFilePetitionSequence,
    submitting: state.submitting,
    updatePetitionValueSequence: sequences.updatePetitionValueSequence,
    trialCities: state.trialCities,
    getTrialCitiesSequence: sequences.getTrialCitiesSequence,
    procedureTypes: state.procedureTypes,
    caseTypes: state.caseTypes,
  },
  function FilePetition({
    caseTypes,
    petition,
    procedureTypes,
    submitFilePetitionSequence,
    submitting,
    getTrialCitiesSequence,
    trialCities,
    updatePetitionValueSequence
  }) {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1" id="file-h1">
          File a petition
        </h1>
        <h2 id="file-metadata">
          Please provide the following requested information
        </h2>
        <p>* All are required.</p>
        <form
          id="file-petition-metadata"
          role="form"
          aria-labelledby="#file-metadata"
          noValidate
        >
          <div role="list">
            <div role="listitem" className="usa-form-group">
              <label htmlFor="irsNoticeDate" className="">
                1. Date of IRS Notice
              </label>
              <span>Date of the notice received from the IRS.</span>
              <input
                id="irsNoticeDate"
                type="date"
                name="irsNoticeDate"
                onChange={e => {
                  updatePetitionValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
            <div role="listitem" className="usa-form-group">
              <label htmlFor="case-type">2. Case type is</label>
              <select
                name="caseType"
                id="case-type"
                aria-labelledby="case-type"
                onChange={e => {
                  updatePetitionValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              >
                <option value=""> -- Select -- </option>
                {caseTypes.map(caseType => (
                  <option key={caseType.type} value={caseType.type}>
                    {caseType.description}
                  </option>
                ))}
              </select>
            </div>
            <div role="listitem" className="usa-form-group">
              <label htmlFor="procedure-type">3. Procedure type is</label>
              <select
                name="procedureType"
                id="procedure-type"
                aria-labelledby="procedure-type"
                onChange={e => {
                  getTrialCitiesSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              >
                <option value=""> -- Select -- </option>
                {procedureTypes.map(procedureType => (
                  <option key={procedureType} value={procedureType}>
                    {procedureType}
                  </option>
                ))}
              </select>
            </div>
            <div role="listitem" className="usa-form-group">
              <label htmlFor="preferred-trial-city">
                4. Preferred trial city is
              </label>
              <select
                name="preferredTrialCity"
                id="preferred-trial-city"
                aria-labelledby="preferred-trial-city"
                onChange={e => {
                  updatePetitionValueSequence({
                    key: e.target.name,
                    value: e.target.value || null,
                  });
                }}
                value={petition.preferredTrialCity || ''}
              >
                <option value=""> -- Select -- </option>
                {trialCities.map((trialCity, idx) => (
                  <option key={idx} value="{trialCity.city}, {trialCity.state}">
                    {trialCity.city}, {trialCity.state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
        <h2>Please upload the following PDFs</h2>
        <p>* All are required.</p>
        <ErrorNotification />
        <form
          id="file-a-petition"
          role="form"
          aria-labelledby="#file-h1"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            submitFilePetitionSequence();
          }}
        >
          <div role="list">
            <div role="listitem" className="usa-form-group">
              <label
                htmlFor="petition-file"
                className={petition.petitionFile && 'validated'}
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
                  updatePetitionValueSequence({
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
            {submitting && <div className="spinner" />}
            <span>{submitting ? 'Uploading' : 'Upload'}</span>
          </button>
          {submitting && (
            <div aria-live="assertive" aria-atomic="true">
              <p>{1 - petition.uploadsFinished} of 1 remaining</p>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: (petition.uploadsFinished * 100) / 1 + '%' }}
                />
              </div>
            </div>
          )}
        </form>
      </section>
    );
  },
);
