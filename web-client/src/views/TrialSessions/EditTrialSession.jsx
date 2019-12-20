import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { LocationInformationForm } from './LocationInformationForm';
import { SessionAssignmentsForm } from './SessionAssignmentsForm';
import { SessionInformationForm } from './SessionInformationForm';
import { TrialSessionDetailHeader } from '../TrialSessionDetail/TrialSessionDetailHeader';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditTrialSession = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.showModal,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
    updateTrialSessionSequence: sequences.updateTrialSessionSequence,
  },
  ({
    form,
    formCancelToggleCancelSequence,
    showModal,
    updateTrialSessionFormDataSequence,
    updateTrialSessionSequence,
  }) => {
    return (
      <>
        <TrialSessionDetailHeader />

        <section className="usa-section grid-container DocumentDetail">
          <h1>Edit Trial Session</h1>

          <form
            noValidate
            aria-labelledby="start-case-header"
            className="usa-form maxw-none"
            role="form"
            onSubmit={e => {
              e.preventDefault();
              updateTrialSessionSequence();
            }}
          >
            {showModal === 'FormCancelModalDialog' && (
              <FormCancelModalDialog onCancelSequence="closeModalAndReturnToTrialSessionsSequence" />
            )}
            <ErrorNotification />

            <p className="margin-bottom-2 required-statement margin-top-05 ">
              All fields required unless otherwise noted
            </p>

            <SessionInformationForm />
            <LocationInformationForm />
            <SessionAssignmentsForm />

            <h2 className="margin-top-4">Session Notes</h2>
            <div className="blue-container margin-bottom-2">
              <div className="usa-form-group margin-bottom-0">
                <label className="usa-label" htmlFor="notes">
                  Trial session notes{' '}
                  <span className="usa-hint">(optional)</span>
                </label>
                <textarea
                  className="usa-textarea"
                  id="notes"
                  maxLength="400"
                  name="notes"
                  value={form.notes}
                  onChange={e => {
                    updateTrialSessionFormDataSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <Button type="submit">Save</Button>
            <Button
              link
              onClick={() => {
                formCancelToggleCancelSequence();
              }}
            >
              Cancel
            </Button>
          </form>
        </section>
      </>
    );
  },
);
