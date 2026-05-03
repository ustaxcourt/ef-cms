import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeaderMenu } from './CaseDetailHeaderMenu';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';
import { Tag } from '@web-client/dawson-ui/ui/tag';

type CaseDetailHeaderProps = {
  hideActionButtons?: boolean;
  className?: string;
  openCaseInNewTab?: boolean;
};

const caseDetailHeaderDeps = {
  CASE_CAPTION_POSTFIX: state.constants.CASE_CAPTION_POSTFIX,
  caseDetailHeaderHelper: state.caseDetailHeaderHelper,
  formattedCaseDetail: state.formattedCaseDetail,
};

export const CaseDetailHeader = connect<
  CaseDetailHeaderProps,
  typeof caseDetailHeaderDeps
>(
  caseDetailHeaderDeps,
  function CaseDetailHeader({
    CASE_CAPTION_POSTFIX,
    caseDetailHeaderHelper,
    className,
    formattedCaseDetail,
    hideActionButtons,
    openCaseInNewTab,
  }) {
    const consolidatedCasesString = formattedCaseDetail.consolidatedCases
      .map(eachCase => eachCase.docketNumberWithSuffix)
      .join(', ');

    const externalNonMobileExternalButtons = () => (
      <NonMobile>
        <div className="tablet:grid-col-4">
          {caseDetailHeaderHelper.showFileDocumentButton && (
            <Button
              secondary
              className="tablet-full-width push-right margin-right-0"
              data-testid="button-file-document"
              href={`/case-detail/${formattedCaseDetail.docketNumber}/before-you-file-a-document`}
              icon="file"
              id="button-file-document"
            >
              File a Document
            </Button>
          )}

          {caseDetailHeaderHelper.showRepresentAPartyButton && (
            <Button
              secondary
              className="tablet-full-width push-right margin-right-0"
              data-testid="request-represent-a-party-button"
              href={`/case-detail/${formattedCaseDetail.docketNumber}/case-association-request`}
            >
              Represent a Party
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
              data-testid="button-first-irs-document"
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

          {caseDetailHeaderHelper.showRepresentAPartyButton && (
            <Button
              className="tablet-full-width margin-right-0"
              data-testid="request-represent-a-party-button-mobile"
              href={`/case-detail/${formattedCaseDetail.docketNumber}/case-association-request`}
            >
              Represent a Party
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
          <div className="red-warning-header" data-testid="sealed-case-banner">
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
              <div className="tablet:grid-col-10">
                <div className="margin-bottom-1 line-height-mono-4">
                  <h1
                    className="heading-2 captioned docket-number-header"
                    data-testid="docket-number-header"
                    tabIndex={-1}
                  >
                    {caseDetailHeaderHelper.showConsolidatedCaseIcon && (
                      <Icon
                        aria-label="consolidated case"
                        className="margin-right-1 icon-consolidated"
                        data-testid={`consolidatedCasesOfLeadCase-${consolidatedCasesString}`}
                        icon="copy"
                        size="1x"
                      />
                    )}
                    <CaseLink
                      formattedCase={formattedCaseDetail}
                      rel={openCaseInNewTab ? 'noreferrer noopener' : ''}
                      target={openCaseInNewTab ? '_blank' : ''}
                      className="mobile-text-wrap"
                    >
                      Docket Number:{' '}
                      {formattedCaseDetail.docketNumberWithSuffix}
                    </CaseLink>
                  </h1>
                  {caseDetailHeaderHelper.hidePublicCaseInformation && (
                    <>
                      {formattedCaseDetail.isLeadCase && (
                        <Tag
                          aria-label={`isLeadCase: ${formattedCaseDetail.isLeadCase}`}
                          id="lead-case-tag"
                          role="note"
                          className="margin-right-1 text-tbottom"
                        >
                          Lead case
                        </Tag>
                      )}
                      <Tag
                        className="margin-right-1 text-tbottom"
                        aria-label={`status: ${formattedCaseDetail.status}`}
                        dataTestId="case-status"
                        id="case-status"
                      >
                        {formattedCaseDetail.status}
                      </Tag>
                      {formattedCaseDetail.associatedJudge && (
                        <Tag
                          aria-label="associated judge"
                          className="margin-right-1 text-tbottom"
                          role="note"
                          iconProps={{ icon: 'gavel' }}
                        >
                          {formattedCaseDetail.associatedJudge}
                        </Tag>
                      )}
                      {caseDetailHeaderHelper.showBlockedTag && (
                        <Tag
                          className="margin-right-1 text-tbottom"
                          dataTestId="blocked-case-icon"
                          iconProps={{ icon: 'hand-paper' }}
                          variant="destructive"
                        >
                          BLOCKED
                        </Tag>
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

CaseDetailHeader.displayName = 'CaseDetailHeader';
