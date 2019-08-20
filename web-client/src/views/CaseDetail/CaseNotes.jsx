import { AddEditCaseNoteModal } from '../TrialSessionWorkingCopy/AddEditCaseNoteModal';
import { DeleteCaseNoteConfirmModal } from '../TrialSessionWorkingCopy/DeleteCaseNoteConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { If } from '../../ustc-ui/If/If';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseNotes = connect(
  {
    openAddEditCaseNoteModalFromDetailSequence:
      sequences.openAddEditCaseNoteModalFromDetailSequence,
    openDeleteCaseNoteConfirmModalSequence:
      sequences.openDeleteCaseNoteConfirmModalSequence,
    showModal: state.showModal,
  },
  ({
    openAddEditCaseNoteModalFromDetailSequence,
    openDeleteCaseNoteConfirmModalSequence,
    showModal,
  }) => {
    return (
      <>
        <div className="case-notes">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <div className="card">
                  <div className="content-wrapper">
                    <If not bind="caseDetail.caseNotes.notes">
                      <button
                        className="usa-button usa-button--unstyled float-right"
                        onClick={() => {
                          openAddEditCaseNoteModalFromDetailSequence();
                        }}
                      >
                        <FontAwesomeIcon icon="plus-circle" />
                        Add Note
                      </button>
                    </If>
                    <h3 className="display-inline">Judge’s Notes</h3>
                    <If bind="caseDetail.caseNotes.notes">
                      <div className="margin-top-1  margin-bottom-4">
                        <Text bind="caseDetail.caseNotes.notes" />
                      </div>
                      <div className="grid-row">
                        <div className="tablet:grid-col-6">
                          <button
                            className="usa-button usa-button--unstyled"
                            onClick={() => {
                              openAddEditCaseNoteModalFromDetailSequence();
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
                              openDeleteCaseNoteConfirmModalSequence();
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
        {showModal === 'DeleteCaseNoteConfirmModal' && (
          <DeleteCaseNoteConfirmModal />
        )}
        {showModal === 'AddEditCaseNoteModal' && (
          <AddEditCaseNoteModal onConfirmSequence="updateCaseNoteOnCaseDetailSequence" />
        )}
      </>
    );
  },
);
