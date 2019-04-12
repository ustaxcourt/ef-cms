import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { Text } from '../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const StartCaseInternal = connect(
  {
    constants: state.constants,
    showModal: state.showModal,
    startACaseToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    startCaseHelper: state.startCaseHelper,
    submitPetitionFromPaperSequence: sequences.submitPetitionFromPaperSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatePetitionValueSequence: sequences.updatePetitionValueSequence,
    validatePetitionFromPaperSequence:
      sequences.validatePetitionFromPaperSequence,
    validationErrors: state.validationErrors,
  },
  ({
    constants,
    showModal,
    formCancelToggleCancelSequence,
    startCaseHelper,
    submitPetitionFromPaperSequence,
    updateFormValueSequence,
    updatePetitionValueSequence,
    validationErrors,
    validatePetitionFromPaperSequence,
  }) => {
    return (
      <section className="usa-section usa-grid">
        <form
          role="form"
          aria-labelledby="start-case-header"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            submitPetitionFromPaperSequence();
          }}
        >
          <h1 tabIndex="-1" id="start-case-header">
            Upload Documents to Create a Case
          </h1>
          {showModal && <FormCancelModalDialog />}
          <ErrorNotification />
          <h2>Petition Documents</h2>

          <div className="blue-container">
            <div
              className={
                'ustc-form-group ' +
                (validationErrors.receivedAt ? 'usa-input-error' : '')
              }
            >
              <fieldset>
                <legend id="date-received-legend with-hint">
                  Date Received{' '}
                  <span className="usa-form-hint">(required)</span>
                </legend>
                <div className="usa-date-of-birth">
                  <div className="usa-form-group usa-form-group-month">
                    <label htmlFor="date-received-month" aria-hidden="true">
                      MM
                    </label>
                    <input
                      className="usa-input-inline"
                      aria-describedby="date-received-legend"
                      id="date-received-month"
                      name="month"
                      aria-label="month, two digits"
                      type="number"
                      min="1"
                      max="12"
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                      onBlur={() => {
                        validatePetitionFromPaperSequence();
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group-day">
                    <label htmlFor="date-received-day" aria-hidden="true">
                      DD
                    </label>
                    <input
                      className="usa-input-inline"
                      aria-describedby="date-received-legend"
                      aria-label="day, two digits"
                      id="date-received-day"
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
                      onBlur={() => {
                        validatePetitionFromPaperSequence();
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group-year">
                    <label htmlFor="date-received-year" aria-hidden="true">
                      YYYY
                    </label>
                    <input
                      className="usa-input-inline"
                      aria-describedby="date-received-legend"
                      aria-label="year, four digits"
                      id="date-received-year"
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
                      onBlur={() => {
                        validatePetitionFromPaperSequence();
                      }}
                    />
                  </div>
                  <Text
                    className="usa-input-error-message"
                    bind="validationErrors.receivedAt"
                  />
                </div>
              </fieldset>
            </div>

            <div
              className={
                'ustc-form-group ' +
                (validationErrors.caseCaption ? 'usa-input-error' : '')
              }
            >
              <label htmlFor="case-caption">
                Case Caption <span className="usa-form-hint">(required)</span>
              </label>
              <textarea
                id="case-caption"
                name="caseCaption"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
                onBlur={() => {
                  validatePetitionFromPaperSequence();
                }}
              />
              {constants.CASE_CAPTION_POSTFIX}
              <Text
                className="usa-input-error-message"
                bind="validationErrors.caseCaption"
              />
            </div>

            <div
              className={`ustc-form-group ${
                validationErrors.petitionFile ? 'usa-input-error' : ''
              }`}
            >
              <label
                htmlFor="petition-file"
                className={
                  'ustc-upload-petition ' +
                  (startCaseHelper.showPetitionFileValid ? 'validated' : '')
                }
              >
                Upload the Petition{' '}
                <span className="usa-form-hint">(required)</span>
                <span className="success-message">
                  <FontAwesomeIcon icon="check-circle" size="sm" />
                </span>
              </label>
              <input
                id="petition-file"
                type="file"
                accept=".pdf"
                aria-describedby="petition-hint"
                name="petitionFile"
                onChange={e => {
                  updatePetitionValueSequence({
                    key: e.target.name,
                    value: e.target.files[0],
                  });
                  validatePetitionFromPaperSequence();
                }}
              />
              <Text
                className="usa-input-error-message"
                bind="validationErrors.petitionFile"
              />
            </div>
          </div>

          <h2>Statement of Taxpayer Identification</h2>
          <div className="blue-container">
            <div
              className={`ustc-form-group ${
                validationErrors.stinFile ? 'usa-input-error' : ''
              }`}
            >
              <label
                htmlFor="stin-file"
                className={
                  'ustc-upload-stin ' +
                  (startCaseHelper.showStinFileValid ? 'validated' : '')
                }
              >
                Upload the Statement of Taxpayer Identification
                <span className="success-message">
                  <FontAwesomeIcon icon="check-circle" size="sm" />
                </span>
              </label>
              <input
                id="stin-file"
                type="file"
                accept=".pdf"
                name="stinFile"
                onChange={e => {
                  updatePetitionValueSequence({
                    key: e.target.name,
                    value: e.target.files[0],
                  });
                  validatePetitionFromPaperSequence();
                }}
              />
              <Text
                className="usa-input-error-message"
                bind="validationErrors.stinFile"
              />
            </div>
          </div>

          <h2>Ownership Disclosure Statement</h2>
          <div className="blue-container">
            <label
              htmlFor="ownership-disclosure-file"
              className={
                'ustc-upload-ods ' +
                (startCaseHelper.showOwnershipDisclosureValid
                  ? 'validated'
                  : '')
              }
            >
              Upload the Ownership Disclosure Statement
              <span className="success-message">
                <FontAwesomeIcon icon="check-circle" size="sm" />
              </span>
            </label>
            <input
              id="ownership-disclosure-file"
              type="file"
              accept=".pdf"
              name="ownershipDisclosureFile"
              onChange={e => {
                updatePetitionValueSequence({
                  key: e.target.name,
                  value: e.target.files[0],
                });
              }}
            />
          </div>

          <button id="submit-case" type="submit" className="usa-button">
            Create Case
          </button>
          <button
            type="button"
            className="usa-button-secondary"
            onClick={() => {
              formCancelToggleCancelSequence();
              return false;
            }}
          >
            Cancel
          </button>
        </form>
      </section>
    );
  },
);
