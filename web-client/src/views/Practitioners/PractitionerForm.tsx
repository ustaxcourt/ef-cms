import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PractitionerContactForm } from './PractitionerContactForm';
import { PractitionerLoginServiceEmailForm } from './PractitionerLoginServiceEmailForm';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PractitionerForm = connect(
  {
    constants: state.constants,
    createPractitionerUserHelper: state.createPractitionerUserHelper,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateSequence: sequences[props.validateSequenceName],
    validationErrors: state.validationErrors,
  },
  function PractitionerForm({
    constants,
    createPractitionerUserHelper,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    updateFormValueSequence,
    validateSequence,
    validateSequenceName,
    validationErrors,
  }) {
    return (
      <>
        <div className="grid-row margin-bottom-4">
          <div className="grid-col-12">
            <p>All fields required unless otherwise noted</p>
            <h2>Practitioner Information</h2>
            <div className="blue-container">
              <div className="grid-row grid-gap-3">
                <div className="grid-col-3">
                  <FormGroup errorText={validationErrors.firstName}>
                    <label className="usa-label" htmlFor="firstName">
                      First name
                    </label>
                    <input
                      autoCapitalize="none"
                      className="usa-input"
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={form.firstName || ''}
                      onBlur={() => {
                        validateSequence();
                      }}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </FormGroup>
                </div>

                <div className="grid-col-3">
                  <FormGroup errorText={validationErrors.middleName}>
                    <label className="usa-label" htmlFor="middleName">
                      Middle name <span className="usa-hint">(optional)</span>
                    </label>
                    <input
                      autoCapitalize="none"
                      className="usa-input"
                      id="middleName"
                      name="middleName"
                      type="text"
                      value={form.middleName || ''}
                      onBlur={() => {
                        validateSequence();
                      }}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </FormGroup>
                </div>

                <div className="grid-col-3">
                  <FormGroup errorText={validationErrors.lastName}>
                    <label className="usa-label" htmlFor="lastName">
                      Last name
                    </label>
                    <input
                      autoCapitalize="none"
                      className="usa-input"
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={form.lastName || ''}
                      onBlur={() => {
                        validateSequence();
                      }}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </FormGroup>
                </div>
                <div className="grid-col-3">
                  <FormGroup>
                    <label className="usa-label" htmlFor="suffix">
                      Suffix <span className="usa-hint">(optional)</span>
                    </label>
                    <input
                      autoCapitalize="none"
                      className="usa-input"
                      id="suffix"
                      name="suffix"
                      type="text"
                      value={form.suffix || ''}
                      onBlur={() => {
                        validateSequence();
                      }}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </FormGroup>
                </div>
              </div>
              <div className="grid-row grid-gap-3">
                <div className="grid-col-12">
                  <FormGroup errorText={validationErrors.birthYear}>
                    <fieldset className="usa-fieldset margin-bottom-0">
                      <legend className="display-block" id="birth-year-legend">
                        Birth year
                        <br />
                        <span className="usa-hint">
                          Enter birth year in four-digit year format (YYYY)
                        </span>
                      </legend>
                      <div className="usa-form-group--year display-inline-block">
                        <input
                          aria-describedby="birth-year-legend"
                          aria-label="birth year, four digits"
                          className="usa-input"
                          id="birthYear"
                          name="birthYear"
                          type="text"
                          value={form.birthYear || ''}
                          onBlur={() => {
                            validateSequence();
                          }}
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </fieldset>
                  </FormGroup>
                  <FormGroup errorText={validationErrors.practitionerType}>
                    <fieldset className="usa-fieldset">
                      <legend className="usa-legend">Practitioner type</legend>
                      {constants.PRACTITIONER_TYPE_OPTIONS.map(type => (
                        <div className="usa-radio usa-radio__inline" key={type}>
                          <input
                            checked={form.practitionerType === type}
                            className="usa-radio__input"
                            id={`practitioner-type-${type}`}
                            name="practitionerType"
                            type="radio"
                            value={type}
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                              validateSequence();
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor={`practitioner-type-${type}`}
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </fieldset>
                  </FormGroup>
                  <FormGroup errorText={validationErrors.employer}>
                    <fieldset className="usa-fieldset">
                      <legend className="usa-legend">Employer</legend>
                      {constants.EMPLOYER_OPTIONS.map(option => (
                        <div
                          className="usa-radio usa-radio__inline"
                          key={option}
                        >
                          <input
                            checked={form.employer === option}
                            className="usa-radio__input"
                            id={`employer-${option}`}
                            name="employer"
                            type="radio"
                            value={option}
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                              validateSequence();
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor={`employer-${option}`}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </fieldset>
                  </FormGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid-row margin-bottom-4">
          <div className="grid-col-12">
            <h2>Contact Information</h2>
            <div className="blue-container">
              <div className="grid-row grid-gap-3">
                <div className="grid-col-12">
                  {createPractitionerUserHelper.showFirmName && (
                    <FormGroup>
                      <label className="usa-label" htmlFor="firmName">
                        Firm name <span className="usa-hint">(optional)</span>
                      </label>
                      <input
                        autoCapitalize="none"
                        className="usa-input"
                        id="firmName"
                        name="firmName"
                        type="text"
                        value={form.firmName || ''}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </FormGroup>
                  )}
                  <PractitionerContactForm
                    bind="form"
                    changeCountryTypeSequenceName="countryTypeUserContactChangeSequence"
                    type="contact"
                    onBlurSequenceName={validateSequenceName}
                    onChangeSequenceName="updateFormValueSequence"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <PractitionerLoginServiceEmailForm
          emailFormName={
            createPractitionerUserHelper.isEditingPractitioner
              ? 'updatedEmail'
              : 'email'
          }
          validateSequenceName={validateSequenceName}
        />

        <div className="grid-row margin-bottom-4">
          <div className="grid-col-12">
            <h2>Admissions Information</h2>
            <div className="blue-container">
              <div className="grid-row grid-gap-3">
                <div className="grid-col-12">
                  <FormGroup errorText={validationErrors.originalBarState}>
                    <label className="usa-label" htmlFor="originalBarState">
                      Original bar state
                    </label>
                    <select
                      className="usa-select"
                      id="originalBarState"
                      name="originalBarState"
                      value={form.originalBarState || ''}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateSequence();
                      }}
                    >
                      <option value="">- Select -</option>
                      <option value="N/A">N/A</option>
                      <optgroup label="State">
                        {Object.keys(constants.US_STATES).map(abbrev => {
                          const fullStateName = constants.US_STATES[abbrev];
                          return (
                            <option key={fullStateName} value={abbrev}>
                              {fullStateName}
                            </option>
                          );
                        })}
                      </optgroup>
                      <optgroup label="Other">
                        {Object.keys(constants.US_STATES_OTHER).map(abbrev => {
                          const fullStateName =
                            constants.US_STATES_OTHER[abbrev];
                          return (
                            <option key={fullStateName} value={abbrev}>
                              {fullStateName}
                            </option>
                          );
                        })}
                      </optgroup>
                    </select>
                  </FormGroup>
                  {createPractitionerUserHelper.canEditAdmissionStatus ? (
                    <FormGroup errorText={validationErrors.admissionsStatus}>
                      <label className="usa-label" htmlFor="admissionsStatus">
                        Admission status
                      </label>

                      <select
                        className="usa-select"
                        id="admissionsStatus"
                        name="admissionsStatus"
                        value={form.admissionsStatus || ''}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                          validateSequence();
                        }}
                      >
                        <option value="">- Select -</option>
                        {constants.ADMISSIONS_STATUS_OPTIONS.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </FormGroup>
                  ) : (
                    <FormGroup>
                      <label className="usa-label" htmlFor="admissionStatus">
                        Admission status
                      </label>

                      <p id="admissionStatus">Active</p>
                    </FormGroup>
                  )}
                  <DateSelector
                    defaultValue={form.admissionsDate}
                    errorText={validationErrors.admissionsDate}
                    id="admissions-date"
                    label="Admissions date"
                    onChange={e => {
                      formatAndUpdateDateFromDatePickerSequence({
                        key: 'admissionsDate',
                        toFormat: constants.DATE_FORMATS.YYYYMMDD,
                        value: e.target.value,
                      });
                      validateSequence();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-row margin-bottom-4">
          <div className="grid-col-12">
            <h2>Practitioner Notes</h2>
            <div className="blue-container">
              <div className="grid-row grid-gap-3">
                <div className="grid-col-12">
                  <FormGroup errorText={validationErrors.practitionerNotes}>
                    <label className="usa-label" htmlFor="practitioner-notes">
                      Practitioner notes{' '}
                      <span className="usa-hint">(optional)</span>
                    </label>
                    <BindedTextarea
                      bind="form.practitionerNotes"
                      id="practitioner-notes"
                      name="practitionerNotes"
                      required={false}
                      onChange={() => {
                        validateSequence();
                      }}
                    ></BindedTextarea>
                  </FormGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);

PractitionerForm.displayName = 'PractitionerForm';
