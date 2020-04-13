import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { PractitionerForm } from './PractitionerForm';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const EditPractitionerUser = connect(
  {
    navigateBackSequence: sequences.navigateBackSequence,
    submitEditPractitionerSequence: sequences.submitEditPractitionerSequence,
  },
  function EditPractitionerUser({
    navigateBackSequence,
    submitEditPractitionerSequence,
  }) {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1>Edit Practitioner Details</h1>
          </div>
        </div>

        <section className="grid-container">
          <SuccessNotification />
          <ErrorNotification />
        </section>

        <div className="grid-container">
          <PractitionerForm />

          <div className="grid-row margin-bottom-6">
            <div className="grid-col-12">
              <Button
                onClick={() => {
                  submitEditPractitionerSequence();
                }}
              >
                Save Updates
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
