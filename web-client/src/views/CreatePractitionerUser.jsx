import { Button } from '../ustc-ui/Button/Button';
import { DateInput } from '../ustc-ui/DateInput/DateInput';
import { ErrorNotification } from './ErrorNotification';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { PractitionerContactEditForm } from './PractitionerContactEditForm';
import { Select } from '../ustc-ui/Select/Select';
import { StateSelect } from './StartCase/StateSelect';
import { SuccessNotification } from './SuccessNotification';
import { capitalize } from 'lodash';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CreatePractitionerUser = connect(
  {
    createPractitionerUserHelper: state.createPractitionerUserHelper,
    form: state.form,
    navigateBackSequence: sequences.navigateBackSequence,
    submitCreatePractitionerUserSequence:
      sequences.submitCreatePractitionerUserSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    usStates: state.constants.US_STATES,
    validatePractitionerUserSequence:
      sequences.validatePractitionerUserSequence,
    validationErrors: state.validationErrors,
  },
  function CreatePractitionerUser({
    form,
    navigateBackSequence,
    submitCreatePractitionerUserSequence,
    updateFormValueSequence,
    usStates,
    validatePractitionerUserSequence,
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
                    <FormGroup errorText={validationErrors.firstname}>
                      <label className="usa-label" htmlFor="firstname">
                        First name
                      </label>
                      <input
                        autoCapitalize="none"
                        className="usa-input"
                        id="firstname"
                        name="firstname"
                        type="text"
                        value={form.firstname || ''}
                        onBlur={() => {
                          validatePractitionerUserSequence();
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
                    <FormGroup errorText={validationErrors.middlename}>
                      <label className="usa-label" htmlFor="middlename">
                        Middle name <span className="usa-hint">(optional)</span>
                      </label>
                      <input
                        autoCapitalize="none"
                        className="usa-input"
                        id="middlename"
                        name="middlename"
                        type="text"
                        value={form.middlename || ''}
                        onBlur={() => {
                          validatePractitionerUserSequence();
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
                    <FormGroup errorText={validationErrors.lastname}>
                      <label className="usa-label" htmlFor="lastname">
                        Last name
                      </label>
                      <input
                        autoCapitalize="none"
                        className="usa-input"
                        id="lastname"
                        name="lastname"
                        type="text"
                        value={form.lastname || ''}
                        onBlur={() => {
                          validatePractitionerUserSequence();
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
                    <FormGroup errorText={validationErrors.suffix}>
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
                          validatePractitionerUserSequence();
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
                    <FormGroup errorText={false}>
                      <fieldset className="usa-fieldset margin-bottom-0">
                        <legend className="display-block" id="year-legend">
                          Birth year
                          <br />
                          <span className="usa-hint">
                            Enter birth year in four-digit year format (YYYY)
                          </span>
                        </legend>
                        <div className="usa-form-group--year display-inline-block">
                          <input
                            aria-describedby="year-legend"
                            aria-label="starting year, four digits"
                            className="usa-input"
                            id="year"
                            name="year"
                            type="text"
                            value={form.year || ''}
                            onBlur={() => {
                              validatePractitionerUserSequence();
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
                          Practitioner Type
                        </legend>
                        <div
                          className="usa-radio usa-radio__inline"
                          key={'Attorney'}
                        >
                          <input
                            checked={form.practitionerType === 'Attorney'}
                            className="usa-radio__input"
                            id={'filing-status-attorney'}
                            name="practitionerType"
                            type="radio"
                            value={'Attorney'}
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                              validatePractitionerUserSequence();
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor={'filing-status-attorney'}
                          >
                            Attorney
                          </label>
                        </div>

                        <div
                          className="usa-radio usa-radio__inline"
                          key={'Non-Attorney'}
                        >
                          <input
                            checked={form.practitionerType === 'Non-Attorney'}
                            className="usa-radio__input"
                            id={'filing-status-non-attorney'}
                            name="practitionerType"
                            type="radio"
                            value={'Non-Attorney'}
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                              validatePractitionerUserSequence();
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor={'filing-status-non-attorney'}
                          >
                            Non-Attorney
                          </label>
                        </div>
                      </fieldset>
                    </FormGroup>

                    <FormGroup errorText={validationErrors.employeer}>
                      <fieldset className="usa-fieldset">
                        <legend className="usa-legend">Employeer</legend>
                        <div
                          className="usa-radio usa-radio__inline"
                          key={'Private'}
                        >
                          <input
                            checked={form.employeer === 'Private'}
                            className="usa-radio__input"
                            id={'employeer-private'}
                            name="employeer"
                            type="radio"
                            value={'Private'}
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                              validatePractitionerUserSequence();
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor={'employeer-private'}
                          >
                            Private
                          </label>
                        </div>

                        <div
                          className="usa-radio usa-radio__inline"
                          key={'IRS'}
                        >
                          <input
                            checked={form.employeer === 'IRS'}
                            className="usa-radio__input"
                            id={'employeer-irs'}
                            name="employeer"
                            type="radio"
                            value={'IRS'}
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                              validatePractitionerUserSequence();
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor={'employeer-irs'}
                          >
                            IRS
                          </label>
                        </div>

                        <div
                          className="usa-radio usa-radio__inline"
                          key={'DOJ'}
                        >
                          <input
                            checked={form.employeer === 'DOJ'}
                            className="usa-radio__input"
                            id={'employeer-doj'}
                            name="employeer"
                            type="radio"
                            value={'DOJ'}
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                              validatePractitionerUserSequence();
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor={'employeer-doj'}
                          >
                            DOJ
                          </label>
                        </div>
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
                        Firm Name
                      </label>
                      <input
                        autoCapitalize="none"
                        className="usa-input"
                        id="firmName"
                        name="firmName"
                        type="text"
                        value={form.firmName || ''}
                        onBlur={() => {
                          validatePractitionerUserSequence();
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
                      onBlurSequenceName="validatePractitionerUserSequence"
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
                    <FormGroup errorText={validationErrors.firmName}>
                      <label className="usa-label" htmlFor="firmName">
                        Original Bar State
                      </label>

                      <select
                        className="usa-select"
                        id={'originalBarState'}
                        name={'originalBarState'}
                        value={form.originalBarState || ''}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                          validatePractitionerUserSequence();
                        }}
                      >
                        <option value="">- Select -</option>
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

                    <FormGroup errorText={validationErrors.firmName}>
                      <label className="usa-label" htmlFor="firmName">
                        Admission Status
                      </label>

                      <p>Active</p>
                    </FormGroup>

                    <DateInput
                      errorText={validationErrors.receivedAt}
                      id="admissionsDate"
                      label="Admissions Date"
                      names={{
                        day: 'admissionsDay',
                        month: 'admissionsMonth',
                        year: 'admissionsYear',
                      }}
                      values={{
                        day: form.admissionsDay,
                        month: form.admissionsMonth,
                        year: form.admissionsYear,
                      }}
                      onBlur={validatePractitionerUserSequence}
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
                  submitCreatePractitionerUserSequence();
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
