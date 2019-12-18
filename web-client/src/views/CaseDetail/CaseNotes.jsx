import { AddEditJudgesCaseNoteModal } from '../TrialSessionWorkingCopy/AddEditJudgesCaseNoteModal';
import { Button } from '../../ustc-ui/Button/Button';
import { DeleteCaseNoteConfirmModal } from './DeleteCaseNoteConfirmModal';
import { DeleteJudgesCaseNoteConfirmModal } from '../TrialSessionWorkingCopy/DeleteJudgesCaseNoteConfirmModal';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseNotes = connect(
  {
    caseDetail: state.caseDetail,
    caseDetailHelper: state.caseDetailHelper,
    openAddEditJudgesCaseNoteModalFromDetailSequence:
      sequences.openAddEditJudgesCaseNoteModalFromDetailSequence,
    openAddEditProceduralNoteModalSequence:
      sequences.openAddEditProceduralNoteModalSequence,
    openDeleteJudgesCaseNoteConfirmModalSequence:
      sequences.openDeleteJudgesCaseNoteConfirmModalSequence,
    openDeleteProceduralNoteConfirmModalSequence:
      sequences.openDeleteProceduralNoteConfirmModalSequence,
    showModal: state.showModal,
  },
  ({
    caseDetail,
    caseDetailHelper,
    openAddEditJudgesCaseNoteModalFromDetailSequence,
    openAddEditProceduralNoteModalSequence,
    openDeleteJudgesCaseNoteConfirmModalSequence,
    openDeleteProceduralNoteConfirmModalSequence,
    showModal,
  }) => {
    return (
      <>
        <div className="case-notes">
          <div className="grid-container padding-x-0 case-notes">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <div className="card height-full">
                  <div className="content-wrapper">
                    {!caseDetail.proceduralNote && (
                      <Button
                        link
                        className="float-right margin-right-0 margin-top-1 padding-0"
                        icon="sticky-note"
                        id="add-procedural-note-button"
                        onClick={() => {
                          openAddEditProceduralNoteModalSequence();
                        }}
                      >
                        Add Case Note
                      </Button>
                    )}
                    <h3 className="underlined">Case Notes</h3>
                    <div className="margin-top-1 margin-bottom-4">
                      <Text bind="caseDetail.proceduralNote" />
                    </div>
                    {caseDetail.proceduralNote && (
                      <div className="grid-row">
                        <div className="tablet:grid-col-6">
                          <Button
                            link
                            icon="edit"
                            onClick={() => {
                              openAddEditProceduralNoteModalSequence();
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
                              openDeleteProceduralNoteConfirmModalSequence();
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
                            openAddEditJudgesCaseNoteModalFromDetailSequence({
                              caseId: caseDetail.caseId,
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
                                openAddEditJudgesCaseNoteModalFromDetailSequence(
                                  {
                                    caseId: caseDetail.caseId,
                                  },
                                );
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
                                openDeleteJudgesCaseNoteConfirmModalSequence({
                                  caseId: caseDetail.caseId,
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
        {showModal === 'DeleteJudgesCaseNoteConfirmModal' && (
          <DeleteJudgesCaseNoteConfirmModal onConfirmSequence="deleteJudgesCaseNoteFromCaseDetailSequence" />
        )}
        {showModal === 'AddEditJudgesCaseNoteModal' && (
          <AddEditJudgesCaseNoteModal onConfirmSequence="updateJudgesCaseNoteOnCaseDetailSequence" />
        )}
        {showModal === 'DeleteCaseNoteConfirmModal' && (
          <DeleteCaseNoteConfirmModal onConfirmSequence="deleteProceduralNoteSequence" />
        )}
      </>
    );
  },
);
