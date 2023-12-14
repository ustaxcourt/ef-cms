import { Button } from '../ustc-ui/Button/Button';
import { ErrorNotification } from './ErrorNotification';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../ustc-ui/Hint/Hint';
import { UserContactEditForm } from './UserContactEditForm';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const UserContactEdit = connect(
  {
    form: state.form,
    navigateBackSequence: sequences.navigateBackSequence,
    submitUpdateUserContactInformationSequence:
      sequences.submitUpdateUserContactInformationSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    userContactEditHelper: state.userContactEditHelper,
  },
  function UserContactEdit({
    form,
    navigateBackSequence,
    submitUpdateUserContactInformationSequence,
    updateFormValueSequence,
    userContactEditHelper,
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
            {userContactEditHelper.showFirmName && (
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
            <UserContactEditForm />
          </div>
          <Button
            data-testid="save-edit-contact"
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

UserContactEdit.displayName = 'UserContactEdit';
