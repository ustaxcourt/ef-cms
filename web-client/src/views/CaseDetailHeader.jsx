import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UpdateCaseCaptionModalDialog } from './CaseDetailEdit/UpdateCaseCaptionModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDetailHeader = connect(
  {
    caseDetail: state.formattedCaseDetail,
    caseHelper: state.caseDetailHelper,
    openCaseCaptionModalSequence: sequences.openCaseCaptionModalSequence,
    showModal: state.showModal,
  },
  ({ caseDetail, caseHelper, showModal, openCaseCaptionModalSequence }) => {
    return (
      <div className="big-blue-header">
        <div className="grid-container">
          <div className="margin-bottom-1">
            <h1 className="heading-2 captioned" tabIndex="-1">
              <a href={'/case-detail/' + caseDetail.docketNumber}>
                Docket Number: {caseDetail.docketNumberWithSuffix}
              </a>
            </h1>
            {caseHelper.hidePublicCaseInformation && (
              <span
                aria-label={`status: ${caseDetail.status}`}
                className="usa-tag"
              >
                <span aria-hidden="true">{caseDetail.status}</span>
              </span>
            )}
          </div>
          <p className="margin-y-0" id="case-title">
            <span>
              {caseDetail.caseTitle}{' '}
              {caseHelper.showCaptionEditButton && (
                <button
                  className="usa-button usa-button--unstyled margin-left-105"
                  id="caption-edit-button"
                  onClick={() => {
                    openCaseCaptionModalSequence();
                  }}
                >
                  <FontAwesomeIcon icon="edit" size="sm" />
                  Edit
                </button>
              )}
            </span>
          </p>
          {showModal == 'UpdateCaseCaptionModalDialog' && (
            <UpdateCaseCaptionModalDialog />
          )}
        </div>
      </div>
    );
  },
);
