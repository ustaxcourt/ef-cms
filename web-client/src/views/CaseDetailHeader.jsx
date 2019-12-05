import { Button } from '../ustc-ui/Button/Button';
import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UpdateCaseModalDialog } from './CaseDetailEdit/UpdateCaseModalDialog';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const CaseDetailHeader = connect(
  {
    caseDetailHeaderHelper: state.caseDetailHeaderHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    hideActionButtons: props.hideActionButtons,
    openCreateOrderChooseTypeModalSequence:
      sequences.openCreateOrderChooseTypeModalSequence,
    openUpdateCaseModalSequence: sequences.openUpdateCaseModalSequence,
    showModal: state.showModal,
  },
  ({
    caseDetailHeaderHelper,
    formattedCaseDetail,
    hideActionButtons,
    openUpdateCaseModalSequence,
    showModal,
  }) => {
    return (
      <div className="big-blue-header">
        <div className="grid-container">
          <div className="grid-row">
            <div className="tablet:grid-col-8">
              <div className="margin-bottom-1">
                <h1 className="heading-2 captioned" tabIndex="-1">
                  {caseDetailHeaderHelper.showConsolidatedCaseIcon && (
                    <FontAwesomeIcon
                      className="margin-right-1 icon-consolidated"
                      icon="copy"
                      size="1x"
                    />
                  )}
                  <CaseLink formattedCase={formattedCaseDetail}>
                    Docket Number: {formattedCaseDetail.docketNumberWithSuffix}
                  </CaseLink>
                </h1>
                {caseDetailHeaderHelper.hidePublicCaseInformation && (
                  <span
                    aria-label={`status: ${formattedCaseDetail.status}`}
                    className="usa-tag"
                  >
                    <span aria-hidden="true">{formattedCaseDetail.status}</span>
                  </span>
                )}

                {caseDetailHeaderHelper.hidePublicCaseInformation &&
                  formattedCaseDetail.associatedJudge && (
                    <span
                      aria-label="associated judge"
                      className="margin-left-1 usa-tag"
                    >
                      <FontAwesomeIcon
                        className="margin-right-05"
                        icon="gavel"
                        size="1x"
                      />
                      {formattedCaseDetail.associatedJudge}
                    </span>
                  )}

                {caseDetailHeaderHelper.hidePublicCaseInformation &&
                  formattedCaseDetail.showBlockedTag && (
                    <span className="margin-left-1 usa-tag red-tag">
                      <FontAwesomeIcon
                        className="margin-right-1"
                        icon="hand-paper"
                        size="1x"
                      />
                      BLOCKED
                    </span>
                  )}
              </div>
              <p className="margin-y-0" id="case-title">
                <span>{formattedCaseDetail.caseTitle}</span>
              </p>
            </div>

            {!hideActionButtons && (
              <div className="tablet:grid-col-4">
                {caseDetailHeaderHelper.showRequestAccessToCaseButton && (
                  <Button
                    className="tablet-full-width push-right margin-right-0"
                    href={`/case-detail/${formattedCaseDetail.docketNumber}/request-access`}
                    id="button-request-access"
                  >
                    Request Access to Case
                  </Button>
                )}

                {caseDetailHeaderHelper.showPendingAccessToCaseButton && (
                  <span
                    aria-label="Request for Access Pending"
                    className="usa-tag push-right margin-right-0 padding-x-3"
                  >
                    <span aria-hidden="true">Request for Access Pending</span>
                  </span>
                )}

                {caseDetailHeaderHelper.showFileFirstDocumentButton && (
                  <Button
                    className="tablet-full-width push-right margin-right-0"
                    href={`/case-detail/${formattedCaseDetail.docketNumber}/file-a-document`}
                    id="button-first-irs-document"
                  >
                    <FontAwesomeIcon icon="file" size="1x" /> File First IRS
                    Document
                  </Button>
                )}

                {caseDetailHeaderHelper.showEditCaseButton && (
                  <>
                    <Button
                      className="tablet-full-width push-right margin-right-0"
                      id="edit-case-context-button"
                      onClick={() => {
                        openUpdateCaseModalSequence();
                      }}
                    >
                      <FontAwesomeIcon icon="edit" size="sm" />
                      Edit
                    </Button>
                    {showModal == 'UpdateCaseModalDialog' && (
                      <UpdateCaseModalDialog />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
