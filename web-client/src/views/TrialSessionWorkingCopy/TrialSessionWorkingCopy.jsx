import { AddEditNoteModal } from './AddEditNoteModal';
import { DeleteNoteConfirmModal } from './DeleteNoteConfirmModal';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { TrialSessionDetailHeader } from '../TrialSessionDetail/TrialSessionDetailHeader';
import { WorkingCopySessionList } from './WorkingCopySessionList';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TrialSessionWorkingCopy = connect(
  { showModal: state.showModal },
  ({ showModal }) => {
    return (
      <>
        <TrialSessionDetailHeader />
        <section className="usa-section grid-container">
          <h2 className="heading-1">Session Working Copy</h2>
          <SuccessNotification />
          <ErrorNotification />
          <WorkingCopySessionList />
          {showModal === 'DeleteNoteConfirmModal' && <DeleteNoteConfirmModal />}
          {showModal === 'AddEditNoteModal' && <AddEditNoteModal />}
        </section>
      </>
    );
  },
);
