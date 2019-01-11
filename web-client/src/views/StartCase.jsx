import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';
import ModalDialog from './ModalDialog';

import ErrorNotification from './ErrorNotification';

export default connect(
  {
    caseTypes: state.caseTypes,
    getTrialCities: sequences.getTrialCitiesSequence,
    form: state.form,
    petition: state.petition,
    procedureTypes: state.procedureTypes,
    startACaseToggleCancelSequence: sequences.startACaseToggleCancelSequence,
    submitFilePetitionSequence: sequences.submitFilePetitionSequence,
    submitting: state.submitting,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatePetitionValueSequence: sequences.updatePetitionValueSequence,
    getTrialCityName: state.getTrialCityName,
  },
  function StartCase({
    caseTypes,
    getTrialCities,
    getTrialCityName,
    form,
    petition,
    procedureTypes,
    startACaseToggleCancelSequence,
    submitFilePetitionSequence,
    submitting,
    updateFormValueSequence,
    updatePetitionValueSequence,
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
          <ModalDialog />
          <ErrorNotification />
          <div className="grey-container are-you-ready">
            <h2>Are you ready?</h2>
            <p>You’ll need the following information to begin a new case.</p>
            <div className="upload-description">
              <div className="icon-wrapper">
                <FontAwesomeIcon icon="file-pdf" size="2x" />
              </div>
              <p className="label-inline">Petition saved as a PDF</p>
              <p>
                Use USTC Form 2 or a custom petition that complies with the
                requirements of the Tax Court Rules of Practice and Proceedure
              </p>
            </div>
            <div className="upload-description">
              <div className="icon-wrapper">
                <FontAwesomeIcon icon="file-pdf" size="2x" />
              </div>
              <p className="label-inline">
                IRS Notice(s) saved as a single PDF
              </p>
              <p>Attach any notices you may have received from the IRS</p>
            </div>
          </div>
          <p className="required-statement">All fields required.</p>
          <h2>Did you receive a notice from the IRS?</h2>
          <div className="blue-container">
            <div className="usa-form-group">
              <label htmlFor="case-type">Type of Notice</label>
              <select
                name="caseType"
                id="case-type"
                aria-labelledby="case-type"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
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
                    name="month"
                    type="number"
                    min="1"
                    max="12"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group-day">
                  <label htmlFor="date-of-notice-day">DD</label>
                  <input
                    className="usa-input-inline"
                    aria-label="day"
                    id="date-of-notice-day"
                    name="day"
                    type="number"
                    min="1"
                    max="31"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group-year">
                  <label htmlFor="date-of-notice-year">YYYY</label>
                  <input
                    className="usa-input-inline"
                    aria-label="year"
                    id="date-of-notice-year"
                    name="year"
                    type="number"
                    min="1900"
                    max="2100"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
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
              <span className="usa-form-hint">
                File must be in PDF format (.pdf).
              </span>
              <input
                id="irs-notice-file"
                type="file"
                accept=".pdf"
                name="irsNoticeFile"
                onChange={e => {
                  updatePetitionValueSequence({
                    key: e.target.name,
                    value: e.target.files[0],
                  });
                }}
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
              <span className="usa-form-hint">
                File must be in PDF format (.pdf).
              </span>
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
          <ul className="usa-accordion">
            <li>
              <button
                type="button"
                className="usa-accordion-button"
                aria-expanded="true"
                aria-controls="a1"
              >
                How is a small case different than a regular case, and do I
                qualify?
              </button>
              <div
                id="a1"
                className="usa-accordion-content"
                aria-hidden="false"
              >
                TODO: Add infographic
              </div>
            </li>
          </ul>
          <div className="blue-container">
            <div className="usa-form-group">
              <fieldset id="radios" className="usa-fieldset-inputs usa-sans">
                <legend>Select Case Procedure</legend>
                <ul className="usa-unstyled-list">
                  {procedureTypes.map(procedureType => (
                    <li key={procedureType}>
                      <input
                        id={procedureType}
                        data-type={procedureType}
                        type="radio"
                        name="procedureType"
                        value={procedureType}
                        onChange={e => {
                          getTrialCities({
                            value: e.currentTarget.value,
                          });
                        }}
                      />
                      <label htmlFor={procedureType}>{procedureType}</label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            </div>
            <div className="usa-form-group">
              <label htmlFor="preferred-trial-city">
                Select a Trial Location
              </label>
              <span className="usa-form-hint">
                Trial locations are unavailable in the following states: DE, KS,
                ME, NH, NJ, ND, RI, SD, VT, WY. Please select the next closest
                location.
              </span>
              <select
                name="preferredTrialCity"
                id="preferred-trial-city"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value || null,
                  });
                }}
                value={form.preferredTrialCity || ''}
              >
                <option value="">-- Select --</option>
                {(form.trialCities || []).map((trialCity, idx) => (
                  <option key={idx} value={getTrialCityName(trialCity)}>
                    {getTrialCityName(trialCity)}
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
            id="submit-case"
            type="submit"
            disabled={submitting}
            className={submitting ? 'usa-button-active' : 'usa-button'}
            aria-disabled={submitting ? 'true' : 'false'}
          >
            {submitting && <div className="spinner" />}
            Submit to U.S. Tax Court
          </button>
          <button
            type="button"
            className="usa-button-secondary"
            onClick={() => {
              startACaseToggleCancelSequence();
              return false;
            }}
          >
            Cancel
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
