import { Button } from '../../ustc-ui/Button/Button';
import { PreformattedText } from '@web-client/ustc-ui/PreformatedText/PreformattedText';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SessionNotes = connect(
  {
    openAddEditSessionNoteModalSequence:
      sequences.openAddEditSessionNoteModalSequence,
    openDeleteSessionNoteConfirmModalSequence:
      sequences.openDeleteSessionNoteConfirmModalSequence,
    sessionNotes: state.trialSessionWorkingCopy.sessionNotes,
  },
  function SessionNotes({
    openAddEditSessionNoteModalSequence,
    openDeleteSessionNoteConfirmModalSequence,
    sessionNotes,
  }) {
    return (
      <>
        <div className="case-notes height-full">
          <div className="card height-full">
            <div className="content-wrapper">
              {!sessionNotes && (
                <div className="float-right">
                  <Button
                    link
                    icon="plus-circle"
                    onClick={() => {
                      openAddEditSessionNoteModalSequence();
                    }}
                  >
                    Add Note
                  </Button>
                </div>
              )}
              {sessionNotes && (
                <>
                  <div className="float-right margin-top-1 action-button-wrapper">
                    <Button
                      link
                      className="padding-0 margin-right-0"
                      icon="edit"
                      onClick={() => {
                        openAddEditSessionNoteModalSequence();
                      }}
                    >
                      Edit Note
                    </Button>
                    <Button
                      link
                      className="red-warning padding-0 margin-left-205 margin-right-0"
                      icon="trash"
                      onClick={() => {
                        openDeleteSessionNoteConfirmModalSequence();
                      }}
                    >
                      Delete Note
                    </Button>
                  </div>
                </>
              )}
              <h3 className="underlined">Session Notes</h3>
              <div className="margin-top-1 margin-bottom-4">
                <PreformattedText text={sessionNotes} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);

SessionNotes.displayName = 'SessionNotes';
