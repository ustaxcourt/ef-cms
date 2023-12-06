import { Button } from '../../ustc-ui/Button/Button';
import { If } from '../../ustc-ui/If/If';
import { TextView } from '../../ustc-ui/Text/TextView';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SessionNotes = connect(
  {
    openAddEditSessionNoteModalSequence:
      sequences.openAddEditSessionNoteModalSequence,
    openDeleteSessionNoteConfirmModalSequence:
      sequences.openDeleteSessionNoteConfirmModalSequence,
  },
  function SessionNotes({
    openAddEditSessionNoteModalSequence,
    openDeleteSessionNoteConfirmModalSequence,
  }) {
    return (
      <>
        <div className="case-notes">
          <div className="card">
            <div className="content-wrapper">
              <If not bind="trialSessionWorkingCopy.sessionNotes">
                <Button
                  link
                  className="float-right"
                  icon="plus-circle"
                  onClick={() => {
                    openAddEditSessionNoteModalSequence();
                  }}
                >
                  Add Note
                </Button>
              </If>
              <h3 className="display-inline">Session Notes</h3>
              <If bind="trialSessionWorkingCopy.sessionNotes">
                <div className="margin-top-1  margin-bottom-4">
                  <TextView bind="trialSessionWorkingCopy.sessionNotes" />
                </div>
                <div className="grid-row">
                  <div className="tablet:grid-col-6">
                    <Button
                      link
                      icon="edit"
                      onClick={() => {
                        openAddEditSessionNoteModalSequence();
                      }}
                    >
                      Edit Note
                    </Button>
                  </div>
                  <div className="tablet:grid-col-6 text-align-right">
                    <Button
                      link
                      className="red-warning"
                      icon="trash"
                      onClick={() => {
                        openDeleteSessionNoteConfirmModalSequence();
                      }}
                    >
                      Delete Note
                    </Button>
                  </div>
                </div>
              </If>
            </div>
          </div>
        </div>
      </>
    );
  },
);

SessionNotes.displayName = 'SessionNotes';
