import { Button } from '../../ustc-ui/Button/Button';
import { EmailVerificationModal } from './EmailVerificationModal';
import { ErrorNotification } from '../ErrorNotification';
import { PractitionerForm } from './PractitionerForm';
import { PractitionerUserHeader } from './PractitionerUserHeader';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EditPractitionerUser = connect(
  {
    form: state.form,
    navigateBackSequence: sequences.navigateBackSequence,
    showModal: state.modal.showModal,
    submitUpdatePractitionerUserSequence:
      sequences.submitUpdatePractitionerUserSequence,
  },
  function EditPractitionerUser({
    navigateBackSequence,
    showModal,
    submitUpdatePractitionerUserSequence,
  }) {
    return (
      <>
        <PractitionerUserHeader />

        <section className="grid-container">
          <h1 className="margin-bottom-1">Edit Practitioner Details</h1>
          <SuccessNotification />
          <ErrorNotification />

          <PractitionerForm validateSequenceName="validateUpdatePractitionerSequence" />

          <div className="grid-row margin-bottom-6">
            <div className="grid-col-12">
              <Button
                onClick={() => {
                  submitUpdatePractitionerUserSequence();
                }}
              >
                Save Updates
              </Button>
              <Button link onClick={() => navigateBackSequence()}>
                Cancel
              </Button>
            </div>
          </div>
        </section>

        {showModal === 'EmailVerificationModal' && <EmailVerificationModal />}
      </>
    );
  },
);

EditPractitionerUser.displayName = 'EditPractitionerUser';
