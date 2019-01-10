import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';

import ErrorNotification from './ErrorNotification';

export default connect(
  {
    caseTypes: state.caseTypes,
    getTrialCities: sequences.getTrialCitiesSequence,
    petition: state.petition,
    procedureTypes: state.procedureTypes,
    submitFilePetitionSequence: sequences.submitFilePetitionSequence,
    submitting: state.submitting,
    trialCities: state.trialCities,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatePetitionValueSequence: sequences.updatePetitionValueSequence,
  },
  function FilePetition({
    caseTypes,
    // getTrialCities,
    petition,
    procedureTypes,
    submitFilePetitionSequence,
    submitting,
    trialCities,
    // updateFormValueSequence,
    // updatePetitionValueSequence,
  }) {
    return (
      <section className="usa-section usa-grid">
        <form
          role="form"
          aria-labelledby="start-case-header"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            submitFilePetitionSequence();
          }}
        >
          <h1 tabIndex="-1" id="start-case-header">
            Start a Case
          </h1>
          <ErrorNotification />
          <p>* All fields required, unless marked as optional.</p>
          <div className="grey-container">
            <p>You’ll need the following information to begin a new case.</p>
            <p>
              <FontAwesomeIcon icon="file-pdf" />
              Petition saved as a PDF
            </p>
            <p>
              Use USTC Form 2 or a custom petition that complies with the
              requirements of the Tax Court Rules of Practice and Proceedure
            </p>
            <p>
              <FontAwesomeIcon icon="file-pdf" />
              IRS Notice(s) saved as a single PDF
            </p>
            <p>Attach any notices you may have received from the IRS</p>
          </div>
          <h2>Did you receive a notice from the IRS?</h2>
          <div className="blue-container">
            <div className="usa-form-group">
              <label htmlFor="case-type">Type of Notice</label>
              <select
                name="caseType"
                id="case-type"
                aria-labelledby="case-type"
                onChange={() => {}}
              >
                <option value="">-- Select --</option>
                {caseTypes.map(caseType => (
                  <option key={caseType.type} value={caseType.type}>
                    {caseType.description}
                  </option>
                ))}
              </select>
            </div>
            <fieldset>
              <legend>Date of Notice</legend>
              <div className="usa-date-of-birth">
                <div className="usa-form-group usa-form-group-month">
                  <label htmlFor="date-of-notice-month">MM</label>
                  <input
                    className="usa-input-inline"
                    aria-label="month"
                    id="date-of-notice-month"
                    name=""
                    type="number"
                    min="1"
                    max="12"
                  />
                </div>
                <div className="usa-form-group usa-form-group-day">
                  <label htmlFor="date-of-notice-day">DD</label>
                  <input
                    className="usa-input-inline"
                    aria-label="day"
                    id="date-of-notice-day"
                    name=""
                    type="number"
                    min="1"
                    max="31"
                  />
                </div>
                <div className="usa-form-group usa-form-group-year">
                  <label htmlFor="date-of-notice-year">YYYY</label>
                  <input
                    className="usa-input-inline"
                    aria-label="year"
                    id="date-of-notice-year"
                    name=""
                    type="number"
                    min="1900"
                    max="2100"
                  />
                </div>
              </div>
            </fieldset>
            <div className="usa-form-group">
              <label
                htmlFor="irs-notice-file"
                className={petition.irsNoticeFile && 'validated'}
              >
                Upload your IRS Notice
              </label>
              <input
                id="irs-notice-file"
                type="file"
                accept=".pdf"
                name="petitionFile"
                onChange={() => {}}
              />
            </div>
          </div>
          <h2>Tell us about your petition.</h2>
          <p>
            You must file a petition to begin a Tax Court case. Please submit a
            completed <a href="/">Form #2</a> or a custom petition that complies
            with the requirements of the{' '}
            <a href="/">Tax Court Rules of Practice and Procedure</a>.
          </p>
          <div className="blue-container">
            <div className="usa-form-group">
              <label
                htmlFor="petition-file"
                className={petition.petitionFile && 'validated'}
              >
                Upload your Petition
              </label>
              <input
                id="petition-file"
                type="file"
                accept=".pdf"
                name="petitionFile"
                onChange={() => {}}
              />
            </div>
            <h3>Who is filing this petition?</h3>
            <div className="usa-form-group">
              <input id="filing-myself" type="radio" name="" />
              <label htmlFor="filing-myself">Myself</label>
            </div>
          </div>
          <h2>How do you want this case to be handled?</h2>
          <p>
            Tax laws allow you to file your dispute as a “small case,” which
            means it’s handled a bit differently than regular cases. You must
            choose to have your case processed as a small case, and the Tax
            Court must agree with your choice. Generally, the Tax Court will
            agree with your request if you qualify for a small case.
          </p>
          <p>
            How is a small case different than a regular case, and do I qualify?
          </p>
          <div className="blue-container">
            <fieldset id="radios" className="usa-fieldset-inputs usa-sans">
              <legend>Select Case Procedure</legend>
              <ul className="usa-unstyled-list">
                {procedureTypes.map(procedureType => (
                  <li key={procedureType}>
                    <input
                      id={procedureType}
                      type="radio"
                      name="procedureType"
                      value={procedureType}
                      onChange={() => {}}
                    />
                    <label htmlFor={procedureType}>{procedureType}</label>
                  </li>
                ))}
              </ul>
            </fieldset>
            <div className="usa-form-group">
              <label htmlFor="procedure-type">Select a Trial Location</label>
              <span className="usa-form-hint">
                Trial locations are unavailable in the following states: DE, KS,
                ME, NH, NJ, ND, RI, SD, VT, WY. Please select the next closest
                location.
              </span>
              <select
                name="procedureType"
                id="procedure-type"
                onChange={() => {}}
              >
                <option value="">-- Select --</option>
                {trialCities.map((trialCity, idx) => (
                  <option key={idx} value="{trialCity.city}, {trialCity.state}">
                    {trialCity.city}, {trialCity.state}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="usa-form-group">
            <input id="signature" type="checkbox" name="signature" />
            <label htmlFor="signature">
              Checking this box acts as your digital signature, acknowledging
              that you’ve verified all information is correct.
            </label>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={submitting ? 'usa-button-active' : 'usa-button'}
            aria-disabled={submitting ? 'true' : 'false'}
          >
            {submitting && <div className="spinner" />}
            Submit to U.S. Tax Court
          </button>
          {submitting && (
            <div aria-live="assertive" aria-atomic="true">
              <p>{2 - petition.uploadsFinished} of 2 remaining</p>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: (petition.uploadsFinished * 100) / 2 + '%' }}
                />
              </div>
            </div>
          )}
        </form>
      </section>
    );
  },
);
