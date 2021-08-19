import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { PractitionerForm } from './PractitionerForm';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const CreatePractitionerUser = connect(
  {
    navigateBackSequence: sequences.navigateBackSequence,
    submitAddPractitionerSequence: sequences.submitAddPractitionerSequence,
  },
  function CreatePractitionerUser({
    navigateBackSequence,
    submitAddPractitionerSequence,
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

          <PractitionerForm validateSequenceName="validateAddPractitionerSequence" />

          <div className="grid-row margin-bottom-6">
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
        </section>
      </>
    );
  },
);
