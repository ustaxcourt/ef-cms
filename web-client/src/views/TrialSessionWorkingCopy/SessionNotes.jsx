import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { If } from '../../ustc-ui/If/If';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const SessionNotes = connect(
  {
    openAddEditSessionNoteModalSequence:
      sequences.openAddEditSessionNoteModalSequence,
    openDeleteSessionNoteConfirmModalSequence:
      sequences.openDeleteSessionNoteConfirmModalSequence,
  },
  ({
    openAddEditSessionNoteModalSequence,
    openDeleteSessionNoteConfirmModalSequence,
  }) => {
    return (
      <>
        <div className="case-notes">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <div className="card">
                  <div className="content-wrapper">
                    <If not bind="trialSessionWorkingCopy.sessionNotes">
                      <button
                        className="usa-button usa-button--unstyled float-right"
                        onClick={() => {
                          openAddEditSessionNoteModalSequence();
                        }}
                      >
                        <FontAwesomeIcon icon="plus-circle" />
                        Add Note
                      </button>
                    </If>
                    <h3 className="display-inline">Session Notes</h3>
                    <If bind="trialSessionWorkingCopy.sessionNotes">
                      <div className="margin-top-1  margin-bottom-4">
                        <Text bind="trialSessionWorkingCopy.sessionNotes" />
                      </div>
                      <div className="grid-row">
                        <div className="tablet:grid-col-6">
                          <button
                            className="usa-button usa-button--unstyled"
                            onClick={() => {
                              openAddEditSessionNoteModalSequence();
                            }}
                          >
                            <FontAwesomeIcon icon="edit"></FontAwesomeIcon>
                            Edit Note
                          </button>
                        </div>
                        <div className="tablet:grid-col-6 text-align-right">
                          <button
                            className="usa-button usa-button--unstyled red-warning"
                            onClick={() => {
                              openDeleteSessionNoteConfirmModalSequence();
                            }}
                          >
                            <FontAwesomeIcon icon="times-circle"></FontAwesomeIcon>
                            Delete Note
                          </button>
                        </div>
                      </div>
                    </If>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);
