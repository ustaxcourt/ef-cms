import { AddEditUserCaseNoteModal } from '../TrialSessionWorkingCopy/AddEditUserCaseNoteModal';
import { Button } from '../../ustc-ui/Button/Button';
import { DeleteCaseNoteConfirmModal } from './DeleteCaseNoteConfirmModal';
import { DeleteUserCaseNoteConfirmModal } from '../TrialSessionWorkingCopy/DeleteUserCaseNoteConfirmModal';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseNotes = connect(
  {
    caseDetail: state.caseDetail,
    caseDetailHelper: state.caseDetailHelper,
    openAddEditCaseNoteModalSequence:
      sequences.openAddEditCaseNoteModalSequence,
    openAddEditUserCaseNoteModalFromDetailSequence:
      sequences.openAddEditUserCaseNoteModalFromDetailSequence,
    openDeleteCaseNoteConfirmModalSequence:
      sequences.openDeleteCaseNoteConfirmModalSequence,
    openDeleteUserCaseNoteConfirmModalSequence:
      sequences.openDeleteUserCaseNoteConfirmModalSequence,
    showModal: state.modal.showModal,
  },
  function CaseNotes({
    caseDetail,
    caseDetailHelper,
    openAddEditCaseNoteModalSequence,
    openAddEditUserCaseNoteModalFromDetailSequence,
    openDeleteCaseNoteConfirmModalSequence,
    openDeleteUserCaseNoteConfirmModalSequence,
    showModal,
  }) {
    return (
      <>
        <div className="case-notes">
          <div className="grid-container padding-x-0 case-notes">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <div className="card height-full">
                  <div className="content-wrapper">
                    {!caseDetail.caseNote && (
                      <Button
                        link
                        className="float-right margin-right-0 margin-top-1 padding-0"
                        icon="sticky-note"
                        id="add-procedural-note-button"
                        onClick={() => {
                          openAddEditCaseNoteModalSequence();
                        }}
                      >
                        Add Case Note
                      </Button>
                    )}
                    <h3 className="underlined">Case Notes</h3>
                    <div className="margin-top-1 margin-bottom-4">
                      <Text bind="caseDetail.caseNote" />
                    </div>
                    {caseDetail.caseNote && (
                      <div className="grid-row">
                        <div className="tablet:grid-col-6">
                          <Button
                            link
                            icon="edit"
                            onClick={() => {
                              openAddEditCaseNoteModalSequence();
                            }}
                          >
                            Edit Note
                          </Button>
                        </div>
                        <div className="tablet:grid-col-6 text-align-right">
                          <Button
                            link
                            className="red-warning no-wrap"
                            icon="trash"
                            id="delete-procedural-note-button"
                            onClick={() => {
                              openDeleteCaseNoteConfirmModalSequence();
                            }}
                          >
                            Delete Note
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {caseDetailHelper.showJudgesNotes && (
                <div className="tablet:grid-col-6">
                  <div className="card height-full">
                    <div className="content-wrapper">
                      {(!caseDetail.judgesNote ||
                        !caseDetail.judgesNote.notes) && (
                        <Button
                          link
                          className="float-right margin-right-0 margin-top-1 padding-0"
                          icon="plus-circle"
                          onClick={() => {
                            openAddEditUserCaseNoteModalFromDetailSequence({
                              docketNumber: caseDetail.docketNumber,
                            });
                          }}
                        >
                          Add Note
                        </Button>
                      )}
                      <h3 className="underlined">Judge’s Notes</h3>
                      <div className="margin-top-1  margin-bottom-4">
                        <Text bind="caseDetail.judgesNote.notes" />
                      </div>
                      {caseDetail.judgesNote && caseDetail.judgesNote.notes && (
                        <div className="grid-row">
                          <div className="tablet:grid-col-6">
                            <Button
                              link
                              icon="edit"
                              onClick={() => {
                                openAddEditUserCaseNoteModalFromDetailSequence({
                                  docketNumber: caseDetail.docketNumber,
                                });
                              }}
                            >
                              Edit Note
                            </Button>
                          </div>
                          <div className="tablet:grid-col-6 text-align-right">
                            <Button
                              link
                              className="red-warning no-wrap"
                              icon="trash"
                              onClick={() => {
                                openDeleteUserCaseNoteConfirmModalSequence({
                                  docketNumber: caseDetail.docketNumber,
                                });
                              }}
                            >
                              Delete Note
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {showModal === 'DeleteUserCaseNoteConfirmModal' && (
          <DeleteUserCaseNoteConfirmModal onConfirmSequence="deleteJudgesCaseNoteFromCaseDetailSequence" />
        )}
        {showModal === 'AddEditUserCaseNoteModal' && (
          <AddEditUserCaseNoteModal onConfirmSequence="updateJudgesCaseNoteOnCaseDetailSequence" />
        )}
        {showModal === 'DeleteCaseNoteConfirmModal' && (
          <DeleteCaseNoteConfirmModal onConfirmSequence="deleteCaseNoteSequence" />
        )}
      </>
    );
  },
);
