import { AddEditCaseNoteModal } from '../TrialSessionWorkingCopy/AddEditCaseNoteModal';
import { Button } from '../../ustc-ui/Button/Button';
import { DeleteCaseNoteConfirmModal } from '../TrialSessionWorkingCopy/DeleteCaseNoteConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { If } from '../../ustc-ui/If/If';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseNotes = connect(
  {
    caseDetail: state.caseDetail,
    openAddEditCaseNoteModalFromDetailSequence:
      sequences.openAddEditCaseNoteModalFromDetailSequence,
    openDeleteCaseNoteConfirmModalSequence:
      sequences.openDeleteCaseNoteConfirmModalSequence,
    showModal: state.showModal,
  },
  ({
    caseDetail,
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
                    <If not bind="caseDetail.caseNote.notes">
                      <Button
                        link
                        className="float-right margin-0 padding-0"
                        onClick={() => {
                          openAddEditCaseNoteModalFromDetailSequence({
                            caseId: caseDetail.caseId,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon="plus-circle" />
                        Add Note
                      </Button>
                    </If>
                    <h3 className="display-inline">Judge’s Notes</h3>
                    <If bind="caseDetail.caseNote.notes">
                      <div className="margin-top-1  margin-bottom-4">
                        <Text bind="caseDetail.caseNote.notes" />
                      </div>
                      <div className="grid-row">
                        <div className="tablet:grid-col-6">
                          <Button
                            link
                            onClick={() => {
                              openAddEditCaseNoteModalFromDetailSequence({
                                caseId: caseDetail.caseId,
                              });
                            }}
                          >
                            <FontAwesomeIcon icon="edit"></FontAwesomeIcon>
                            Edit Note
                          </Button>
                        </div>
                        <div className="tablet:grid-col-6 text-align-right">
                          <Button
                            link
                            className="red-warning"
                            onClick={() => {
                              openDeleteCaseNoteConfirmModalSequence({
                                caseId: caseDetail.caseId,
                              });
                            }}
                          >
                            <FontAwesomeIcon icon="times-circle"></FontAwesomeIcon>
                            Delete Note
                          </Button>
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
          <DeleteCaseNoteConfirmModal onConfirmSequence="deleteCaseNoteFromCaseDetailSequence" />
        )}
        {showModal === 'AddEditCaseNoteModal' && (
          <AddEditCaseNoteModal onConfirmSequence="updateCaseNoteOnCaseDetailSequence" />
        )}
      </>
    );
  },
);
