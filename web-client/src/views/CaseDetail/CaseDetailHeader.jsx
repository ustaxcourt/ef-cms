import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeaderMenu } from './CaseDetailHeaderMenu';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const CaseDetailHeader = connect(
  {
    CASE_CAPTION_POSTFIX: state.constants.CASE_CAPTION_POSTFIX,
    caseDetailHeaderHelper: state.caseDetailHeaderHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    hideActionButtons: props.hideActionButtons,
  },
  function CaseDetailHeader({
    CASE_CAPTION_POSTFIX,
    caseDetailHeaderHelper,
    className,
    formattedCaseDetail,
    hideActionButtons,
  }) {
    const externalNonMobileExternalButtons = () => (
      <NonMobile>
        <div className="tablet:grid-col-4">
          {caseDetailHeaderHelper.showFileDocumentButton && (
            <Button
              secondary
              className="tablet-full-width push-right margin-right-0"
              href={`/case-detail/${formattedCaseDetail.docketNumber}/before-you-file-a-document`}
              icon="file"
              id="button-file-document"
            >
              File a Document
            </Button>
          )}

          {caseDetailHeaderHelper.showRequestAccessToCaseButton && (
            <Button
              secondary
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
              secondary
              className="tablet-full-width push-right margin-right-0"
              href={`/case-detail/${formattedCaseDetail.docketNumber}/file-a-document`}
              icon="file"
              id="button-first-irs-document"
            >
              File First IRS Document
            </Button>
          )}
        </div>
      </NonMobile>
    );
    const externalMobileExternalButtons = () => (
      <Mobile>
        <section className="usa-section grid-container margin-top-2 padding-bottom-3">
          {caseDetailHeaderHelper.showFileDocumentButton && (
            <Button
              className="tablet-full-width margin-right-0"
              href={`/case-detail/${formattedCaseDetail.docketNumber}/before-you-file-a-document`}
              icon="file"
              id="button-file-document"
            >
              File a Document
            </Button>
          )}

          {caseDetailHeaderHelper.showRequestAccessToCaseButton && (
            <Button
              className="tablet-full-width margin-right-0"
              href={`/case-detail/${formattedCaseDetail.docketNumber}/request-access`}
              id="button-request-access"
            >
              Request Access to Case
            </Button>
          )}

          {caseDetailHeaderHelper.showPendingAccessToCaseButton && (
            <span
              aria-label="Request for Access Pending"
              className="usa-tag margin-right-0 padding-x-3"
            >
              <span aria-hidden="true">Request for Access Pending</span>
            </span>
          )}

          {caseDetailHeaderHelper.showFileFirstDocumentButton && (
            <Button
              className="tablet-full-width margin-right-0"
              href={`/case-detail/${formattedCaseDetail.docketNumber}/file-a-document`}
              icon="file"
              id="button-first-irs-document"
            >
              File First IRS Document
            </Button>
          )}
        </section>
      </Mobile>
    );

    return (
      <>
        {caseDetailHeaderHelper.showSealedCaseBanner && (
          <div className="red-warning-header sealed-banner">
            <div className="grid-container text-bold">
              <Icon
                aria-label="sealed case"
                className="margin-right-1 icon-sealed"
                icon="lock"
                size="1x"
              />
              This case is sealed
            </div>
          </div>
        )}
        <div className={classNames(className, 'big-blue-header')}>
          <div className="grid-container">
            <div className="display-flex flex-row flex-justify">
              <div className="tablet:grid-col-8">
                <div className="margin-bottom-1">
                  <h1 className="heading-2 captioned" tabIndex="-1">
                    {caseDetailHeaderHelper.showConsolidatedCaseIcon && (
                      <Icon
                        aria-label="consolidated case"
                        className="margin-right-1 icon-consolidated"
                        icon="copy"
                        size="1x"
                      />
                    )}
                    <CaseLink formattedCase={formattedCaseDetail}>
                      Docket Number:{' '}
                      {formattedCaseDetail.docketNumberWithSuffix}
                    </CaseLink>
                  </h1>
                  {caseDetailHeaderHelper.hidePublicCaseInformation && (
                    <>
                      <span
                        aria-label={`status: ${formattedCaseDetail.status}`}
                        className="usa-tag"
                      >
                        <span aria-hidden="true">
                          {formattedCaseDetail.status}
                        </span>
                      </span>
                      {formattedCaseDetail.associatedJudge && (
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
                      {caseDetailHeaderHelper.showBlockedTag && (
                        <span className="margin-left-1 usa-tag red-tag">
                          <FontAwesomeIcon
                            className="margin-right-1"
                            icon="hand-paper"
                            size="1x"
                          />
                          BLOCKED
                        </span>
                      )}
                    </>
                  )}
                </div>
                <p className="margin-y-0" id="case-title">
                  <span>
                    {formattedCaseDetail.caseCaption} {CASE_CAPTION_POSTFIX}
                  </span>
                </p>
                {caseDetailHeaderHelper.showRepresented && (
                  <p
                    className="margin-y-0 represented-text "
                    id="represented-label"
                  >
                    <span>
                      <FontAwesomeIcon
                        className="margin-right-1"
                        icon="user-friends"
                        size="1x"
                      />
                      Represented
                    </span>
                  </p>
                )}
              </div>

              {!hideActionButtons &&
                caseDetailHeaderHelper.showExternalButtons &&
                externalNonMobileExternalButtons()}

              {!hideActionButtons &&
                caseDetailHeaderHelper.showCaseDetailHeaderMenu && (
                  <CaseDetailHeaderMenu />
                )}
            </div>
          </div>
        </div>

        {!hideActionButtons &&
          caseDetailHeaderHelper.showExternalButtons &&
          externalMobileExternalButtons()}
      </>
    );
  },
);
