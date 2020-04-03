import { Button } from '../ustc-ui/Button/Button';
import { ErrorNotification } from './ErrorNotification';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { SuccessNotification } from './SuccessNotification';
import { UserContactEditForm } from './UserContactEditForm';
import { capitalize } from 'lodash';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditPractitionerUser = connect(
  {
    createPractitionerUserHelper: state.createPractitionerUserHelper,
    form: state.form,
    navigateBackSequence: sequences.navigateBackSequence,
    submitUpdatePractitionerUserSequence:
      sequences.submitUpdatePractitionerUserSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validatePractitionerUserSequence:
      sequences.validatePractitionerUserSequence,
    validationErrors: state.validationErrors,
  },
  function EditPractitionerUser({
    createPractitionerUserHelper,
    form,
    navigateBackSequence,
    submitUpdatePractitionerUserSequence,
    updateFormValueSequence,
    validatePractitionerUserSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1>Edit Practitioner User</h1>
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
                    validatePractitionerUserSequence();
                  }}
                >
                  <option value="">- Select -</option>
                  {createPractitionerUserHelper.roles.map(role => (
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

              <UserContactEditForm
                bind="form"
                changeCountryTypeSequenceName="countryTypeUserContactChangeSequence"
                type="contact"
                onBlurSequenceName="validatePractitionerUserSequence"
                onChangeSequenceName="updateFormValueSequence"
              />

              <Button
                onClick={() => {
                  submitUpdatePractitionerUserSequence();
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
