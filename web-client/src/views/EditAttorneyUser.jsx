import { Button } from '../ustc-ui/Button/Button';
import { ErrorNotification } from './ErrorNotification';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { SuccessNotification } from './SuccessNotification';
import { UserContactEditForm } from './UserContactEditForm';
import { capitalize } from 'lodash';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditAttorneyUser = connect(
  {
    createAttorneyUserHelper: state.createAttorneyUserHelper,
    form: state.form,
    navigateBackSequence: sequences.navigateBackSequence,
    submitUpdateAttorneyUserSequence:
      sequences.submitUpdateAttorneyUserSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateAttorneyUserSequence: sequences.validateAttorneyUserSequence,
    validationErrors: state.validationErrors,
  },
  ({
    createAttorneyUserHelper,
    form,
    navigateBackSequence,
    submitUpdateAttorneyUserSequence,
    updateFormValueSequence,
    validateAttorneyUserSequence,
    validationErrors,
  }) => {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1>Edit Attorney User</h1>
          </div>
        </div>

        <section className="grid-container">
          <SuccessNotification />
          <ErrorNotification />
        </section>

        <div className="grid-container">
          <div className="grid-row">
            <div className="grid-col-12">
              <FormGroup errorText={validationErrors.name}>
                <label className="usa-label" htmlFor="name">
                  Name
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input"
                  id="name"
                  name="name"
                  type="text"
                  value={form.name || ''}
                  onBlur={() => {
                    validateAttorneyUserSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </FormGroup>

              <FormGroup errorText={validationErrors.email}>
                <label className="usa-label" htmlFor="email">
                  Email
                </label>
                <p>{form.email}</p>
              </FormGroup>

              <FormGroup>
                <label className="usa-label" htmlFor="country-type">
                  Select role
                </label>
                <select
                  className="usa-select"
                  id="role"
                  name="role"
                  value={form.role || ''}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                    validateAttorneyUserSequence();
                  }}
                >
                  <option value="">- Select -</option>
                  {createAttorneyUserHelper.roles.map(role => (
                    <option key={role} value={role}>
                      {capitalize(role)}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup errorText={validationErrors.barNumber}>
                <label className="usa-label" htmlFor="barNumber">
                  Bar Number {/* TODO: Should this be required? */}
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input"
                  id="barNumber"
                  name="barNumber"
                  type="text"
                  value={form.barNumber || ''}
                  onBlur={() => {
                    validateAttorneyUserSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </FormGroup>

              <UserContactEditForm
                bind="form"
                changeCountryTypeSequenceName="countryTypeUserContactChangeSequence"
                type="contact"
                onBlurSequenceName="validateAttorneyUserSequence"
                onChangeSequenceName="updateFormValueSequence"
              />

              <Button
                onClick={() => {
                  submitUpdateAttorneyUserSequence();
                }}
              >
                Save
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
