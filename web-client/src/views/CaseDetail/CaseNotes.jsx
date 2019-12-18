import { AddEditCaseNoteModal } from '../TrialSessionWorkingCopy/AddEditCaseNoteModal';
import { Button } from '../../ustc-ui/Button/Button';
import { DeleteCaseNoteConfirmModal } from '../TrialSessionWorkingCopy/DeleteCaseNoteConfirmModal';
import { DeleteProceduralNoteConfirmModal } from './DeleteProceduralNoteConfirmModal';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseNotes = connect(
  {
    caseDetail: state.caseDetail,
    caseDetailHelper: state.caseDetailHelper,
    openAddEditCaseNoteModalFromDetailSequence:
      sequences.openAddEditCaseNoteModalFromDetailSequence,
    openAddEditProceduralNoteModalSequence:
      sequences.openAddEditProceduralNoteModalSequence,
    openDeleteCaseNoteConfirmModalSequence:
      sequences.openDeleteCaseNoteConfirmModalSequence,
    openDeleteProceduralNoteConfirmModalSequence:
      sequences.openDeleteProceduralNoteConfirmModalSequence,
    showModal: state.showModal,
  },
  ({
    caseDetail,
    caseDetailHelper,
    openAddEditCaseNoteModalFromDetailSequence,
    openAddEditProceduralNoteModalSequence,
    openDeleteCaseNoteConfirmModalSequence,
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
                      {(!caseDetail.caseNote || !caseDetail.caseNote.notes) && (
                        <Button
                          link
                          className="float-right margin-right-0 margin-top-1 padding-0"
                          icon="plus-circle"
                          onClick={() => {
                            openAddEditCaseNoteModalFromDetailSequence({
                              caseId: caseDetail.caseId,
                            });
                          }}
                        >
                          Add Note
                        </Button>
                      )}
                      <h3 className="underlined">Judge’s Notes</h3>
                      <div className="margin-top-1  margin-bottom-4">
                        <Text bind="caseDetail.caseNote.notes" />
                      </div>
                      {caseDetail.caseNote && caseDetail.caseNote.notes && (
                        <div className="grid-row">
                          <div className="tablet:grid-col-6">
                            <Button
                              link
                              icon="edit"
                              onClick={() => {
                                openAddEditCaseNoteModalFromDetailSequence({
                                  caseId: caseDetail.caseId,
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
                                openDeleteCaseNoteConfirmModalSequence({
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
        {showModal === 'DeleteCaseNoteConfirmModal' && (
          <DeleteCaseNoteConfirmModal onConfirmSequence="deleteCaseNoteFromCaseDetailSequence" />
        )}
        {showModal === 'AddEditCaseNoteModal' && (
          <AddEditCaseNoteModal onConfirmSequence="updateCaseNoteOnCaseDetailSequence" />
        )}
        {showModal === 'DeleteProceduralNoteConfirmModal' && (
          <DeleteProceduralNoteConfirmModal onConfirmSequence="deleteProceduralNoteSequence" />
        )}
      </>
    );
  },
);
