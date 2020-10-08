import { Button } from '../ustc-ui/Button/Button';
import { ErrorNotification } from './ErrorNotification';
import { Hint } from '../ustc-ui/Hint/Hint';
import { UserContactEditForm } from './UserContactEditForm';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const UserContactEdit = connect(
  {
    form: state.form,
    navigateBackSequence: sequences.navigateBackSequence,
    submitUpdateUserContactInformationSequence:
      sequences.submitUpdateUserContactInformationSequence,
  },
  function UserContactEdit({
    form,
    navigateBackSequence,
    submitUpdateUserContactInformationSequence,
  }) {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1>Edit Contact Information</h1>
          </div>
        </div>
        <section className="usa-section grid-container">
          <ErrorNotification />

          <p>
            This form will automatically create and submit change of contact
            information notifications for all of your cases. Please ensure your
            information is accurate before submitting.
          </p>

          <Hint wider>
            For name and Bar Number changes, please contact the Court’s
            Admissions section at (202) 521-0700
          </Hint>

          <div className="blue-container margin-bottom-5">
            <div className="usa-form-group">
              <p className="usa-label margin-bottom-0">Contact name</p>
              <p className="margin-top-0">
                {form.name} ({form.barNumber})
              </p>
            </div>
            <UserContactEditForm
              bind="form"
              changeCountryTypeSequenceName="countryTypeUserContactChangeSequence"
              type="contact"
              onBlurSequenceName="validateUserContactSequence"
              onChangeSequenceName="updateFormValueSequence"
            />
          </div>
          <Button
            onClick={() => {
              submitUpdateUserContactInformationSequence();
            }}
          >
            Save
          </Button>
          <Button link onClick={() => navigateBackSequence()}>
            Cancel
          </Button>
        </section>
      </>
    );
  },
);
