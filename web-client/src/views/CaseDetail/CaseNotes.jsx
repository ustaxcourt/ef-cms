import { AddEditNoteModal } from '../TrialSessionWorkingCopy/AddEditNoteModal';
import { DeleteNoteConfirmModal } from '../TrialSessionWorkingCopy/DeleteNoteConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { If } from '../../ustc-ui/If/If';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseNotes = connect(
  {
    caseDetail: state.formattedCaseDetail,
    openAddEditNoteModalFromDetailSequence:
      sequences.openAddEditNoteModalFromDetailSequence,
    openDeleteNoteConfirmModalSequence:
      sequences.openDeleteNoteConfirmModalSequence,
    showModal: state.showModal,
  },
  ({
    caseDetail,
    openAddEditNoteModalFromDetailSequence,
    openDeleteNoteConfirmModalSequence,
    showModal,
  }) => {
    return (
      <>
        <div className="case-notes">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <div className="card height-full">
                  <div className="content-wrapper">
                    <If
                      not
                      bind={`trialSessionWorkingCopy.caseMetadata.${caseDetail.docketNumber}.notes`}
                    >
                      <button
                        className="usa-button usa-button--unstyled float-right"
                        onClick={() => {
                          openAddEditNoteModalFromDetailSequence({
                            docketNumber: caseDetail.docketNumber,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon="plus-circle" />
                        Add Note
                      </button>
                    </If>
                    <h3 className="display-inline">Judge’s Notes</h3>
                    <If
                      bind={`trialSessionWorkingCopy.caseMetadata.${caseDetail.docketNumber}.notes`}
                    >
                      <div className="margin-top-1  margin-bottom-4">
                        <Text
                          bind={`trialSessionWorkingCopy.caseMetadata.${caseDetail.docketNumber}.notes`}
                        />
                      </div>
                      <div className="grid-row">
                        <div className="tablet:grid-col-6">
                          <button
                            className="usa-button usa-button--unstyled"
                            onClick={() => {
                              openAddEditNoteModalFromDetailSequence({
                                docketNumber: caseDetail.docketNumber,
                              });
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
                              openDeleteNoteConfirmModalSequence({
                                docketNumber: caseDetail.docketNumber,
                              });
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
        {showModal === 'DeleteNoteConfirmModal' && <DeleteNoteConfirmModal />}
        {showModal === 'AddEditNoteModal' && <AddEditNoteModal />}
      </>
    );
  },
);
