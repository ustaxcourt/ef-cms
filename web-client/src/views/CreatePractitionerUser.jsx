import { Button } from '../ustc-ui/Button/Button';
import { DateInput } from '../ustc-ui/DateInput/DateInput';
import { ErrorNotification } from './ErrorNotification';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { PractitionerContactEditForm } from './PractitionerContactEditForm';
import { SuccessNotification } from './SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CreatePractitionerUser = connect(
  {
    EMPLOYER_OPTIONS: state.constants.EMPLOYER_OPTIONS,
    PRACTITIONER_TYPE_OPTIONS: state.constants.PRACTITIONER_TYPE_OPTIONS,
    createPractitionerUserHelper: state.createPractitionerUserHelper,
    form: state.form,
    navigateBackSequence: sequences.navigateBackSequence,
    submitAddPractitionerSequence: sequences.submitAddPractitionerSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    usStates: state.constants.US_STATES,
    validateAddPractitionerSequence: sequences.validateAddPractitionerSequence,
    validationErrors: state.validationErrors,
  },
  function CreatePractitionerUser({
    EMPLOYER_OPTIONS,
    form,
    navigateBackSequence,
    PRACTITIONER_TYPE_OPTIONS,
    submitAddPractitionerSequence,
    updateFormValueSequence,
    usStates,
    validateAddPractitionerSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1>Add New Practitioner</h1>
          </div>
        </div>

        <section className="grid-container">
          <SuccessNotification />
          <ErrorNotification />
        </section>

        <div className="grid-container">
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
                          validateAddPractitionerSequence();
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
                          validateAddPractitionerSequence();
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
                          validateAddPractitionerSequence();
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
                          validateAddPractitionerSequence();
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
                        <legend
                          className="display-block"
                          id="birth-year-legend"
                        >
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
                              validateAddPractitionerSequence();
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
                        <legend className="usa-legend">
                          Practitioner type
                        </legend>
                        {PRACTITIONER_TYPE_OPTIONS.map(type => (
                          <div
                            className="usa-radio usa-radio__inline"
                            key={type}
                          >
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
                                validateAddPractitionerSequence();
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
                        {EMPLOYER_OPTIONS.map(option => (
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
                                validateAddPractitionerSequence();
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
                    <FormGroup errorText={validationErrors.firmName}>
                      <label className="usa-label" htmlFor="firmName">
                        Firm name
                      </label>
                      <input
                        autoCapitalize="none"
                        className="usa-input"
                        id="firmName"
                        name="firmName"
                        type="text"
                        value={form.firmName || ''}
                        onBlur={() => {
                          validateAddPractitionerSequence();
                        }}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </FormGroup>

                    <PractitionerContactEditForm
                      bind="form"
                      changeCountryTypeSequenceName="countryTypeUserContactChangeSequence"
                      type="contact"
                      onBlurSequenceName="validateAddPractitionerSequence"
                      onChangeSequenceName="updateFormValueSequence"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                          validateAddPractitionerSequence();
                        }}
                      >
                        <option value="">- Select -</option>
                        <option value="N/A">N/A</option>
                        <optgroup label="State">
                          {Object.keys(usStates).map(abbrev => {
                            const label = usStates[abbrev];
                            return (
                              <option key={abbrev} value={abbrev}>
                                {label}
                              </option>
                            );
                          })}
                        </optgroup>
                        <optgroup label="Other">
                          <option value="AA">AA</option>
                          <option value="AE">AE</option>
                          <option value="AP">AP</option>
                          <option value="AS">AS</option>
                          <option value="FM">FM</option>
                          <option value="GU">GU</option>
                          <option value="MH">MH</option>
                          <option value="MP">MP</option>
                          <option value="PW">PW</option>
                          <option value="PR">PR</option>
                          <option value="VI">VI</option>
                        </optgroup>
                      </select>
                    </FormGroup>

                    <FormGroup>
                      <label className="usa-label" htmlFor="admissionStatus">
                        Admission status
                      </label>

                      <p id="admissionStatus">Active</p>
                    </FormGroup>

                    <DateInput
                      errorText={validationErrors.admissionsDate}
                      id="admissionsDate"
                      label="Admissions date"
                      names={{
                        day: 'day',
                        month: 'month',
                        year: 'year',
                      }}
                      values={{
                        day: form.day,
                        month: form.month,
                        year: form.year,
                      }}
                      onBlur={validateAddPractitionerSequence}
                      onChange={updateFormValueSequence}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-row">
            <div className="grid-col-12">
              <Button
                onClick={() => {
                  submitAddPractitionerSequence();
                }}
              >
                Add Practitioner
              </Button>
              <Button link onClick={() => navigateBackSequence()}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  },
);
