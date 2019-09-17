import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
import { CreateOrderChooseTypeModal } from './CreateOrder/CreateOrderChooseTypeModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UpdateCaseCaptionModalDialog } from './CaseDetailEdit/UpdateCaseCaptionModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDetailHeader = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    openCaseCaptionModalSequence: sequences.openCaseCaptionModalSequence,
    openCreateOrderChooseTypeModalSequence:
      sequences.openCreateOrderChooseTypeModalSequence,
    showModal: state.showModal,
  },
  ({
    caseDetailHelper,
    formattedCaseDetail,
    openCaseCaptionModalSequence,
    openCreateOrderChooseTypeModalSequence,
    showModal,
  }) => {
    return (
      <div className="big-blue-header">
        <div className="grid-container">
          <div className="grid-row">
            <div className="tablet:grid-col-8">
              <div className="margin-bottom-1">
                <h1 className="heading-2 captioned" tabIndex="-1">
                  <CaseLink formattedCase={formattedCaseDetail}>
                    Docket Number: {formattedCaseDetail.docketNumberWithSuffix}
                  </CaseLink>
                </h1>
                {caseDetailHelper.hidePublicCaseInformation && (
                  <span
                    aria-label={`status: ${formattedCaseDetail.status}`}
                    className="usa-tag"
                  >
                    <span aria-hidden="true">{formattedCaseDetail.status}</span>
                  </span>
                )}
              </div>
              <p className="margin-y-0" id="case-title">
                <span>
                  {formattedCaseDetail.caseTitle}{' '}
                  {caseDetailHelper.showCaptionEditButton && (
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
            <div className="tablet:grid-col-4">
              {caseDetailHelper.showCreateOrderButton && (
                <button
                  className="usa-button usa-button--inverse float-right"
                  href={`/case-detail/${formattedCaseDetail.docketNumber}/create-order`}
                  id="button-create-order"
                  onClick={() => openCreateOrderChooseTypeModalSequence()}
                >
                  <FontAwesomeIcon icon="clipboard-list" size="1x" /> Create
                  Order
                </button>
              )}
              {showModal == 'CreateOrderChooseTypeModal' && (
                <CreateOrderChooseTypeModal />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
